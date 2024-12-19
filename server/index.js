import "dotenv/config";
import express from "express";
import cors from 'cors';
import initKnex from "knex";
import config from "./knexfile.js";
const knex = initKnex(config.development);


const app = express();
app.use(cors());
app.use(express.json())

const PORT = process.env.PORT || 8080;

app.use((req,res,next) => {
  console.log(`req ${req.method} ${req.url} received at ${new Date().toLocaleString()}`)
  if(req.method === 'POST'){
      console.log(req.body)
  }
  next();
})

app.get('/games', async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1; 
    let limit = parseInt(req.query.limit) || 25; 
    let offset = (page - 1) * limit;

    const fields = [];
    const values = [];

    if (req.query.p) {
      fields.push('platforms.platform_id');
      values.push(Array.isArray(req.query.p) ? req.query.p : [req.query.p]);
    }
    if (req.query.g) {
      fields.push('genres.genre_id');
      values.push(Array.isArray(req.query.g) ? req.query.g : [req.query.g]);
    }
    if (req.query.s) {
      fields.push('subscription_services.service_id');
      values.push(Array.isArray(req.query.s) ? req.query.s : [req.query.s]);
    }

    let games, gameCount;
    if (req.query.q) {
      games = await searchQuery(req.query.q, fields, values, limit, offset);
      gameCount = (await searchQuery(req.query.q, fields, values, 10000, 0)).length;
    } else {
      games = await filterQuery(fields, values, limit, offset);
      gameCount = (await filterQuery(fields, values, 10000, 0)).length; 
    }

    let pagination = {
      page: page,
      totalGames: gameCount,
      totalPages: Math.ceil(gameCount / limit)
    };

    res.status(200).json({ games, pagination });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Unable to retrieve games data`,
    });
  }
});

  

  app.get('/game/:id', async (req, res) => {
    try {
      let gameId = Number(req.params.id)
      let game = await filterQuery(['games.game_id'],[gameId],1,0) 

      game[0].description=game[0].description.replace(/\r?\n/g, `
        `);

      res.status(200).json({game});
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: `Unable to retrieve game data`,
      });
    }
    });

app.get('/services', async (req, res) => {
  try {
    let services = await knex('subscription_services').select('name','service_id')
    res.status(200).json(services);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Unable to retrieve subscription service data`,
    });
  }
  });  

  app.get('/genres', async (req, res) => {
    try {
      let genres = await knex('genres').select('name','genre_id')
      res.status(200).json(genres);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: `Unable to retrieve games data`,
      });
    }
    });  
  
    app.get('/platforms', async (req, res) => {
      try {
        let platforms = await knex('platforms').select('name','platform_id')
        res.status(200).json(platforms);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: `Unable to retrieve games data`,
        });
      }
      });  

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});



const filterQuery = async (fields, values, limit, offset) => {
  let query = baseQuery.clone();
  console.log(fields,values)
  fields.forEach((field, index) => { 
    if (Array.isArray(values[index])) {
      query = query.whereIn(field, values[index]);
    } else {
      query = query.where(field, values[index]);
    }
  });

  let response = await query
    .groupBy('games.game_id')
    .limit(limit)
    .offset(offset);
  
  return response;
};


const genQuery = async (limit, offset) =>{
  let games = await baseQuery.clone().groupBy('games.game_id').limit(limit).offset(offset);

  return games
}

const baseQuery = knex('games')
.leftJoin('game_platforms_join', 'games.game_id', 'game_platforms_join.game_id')
.leftJoin('platforms', 'game_platforms_join.platform_id', 'platforms.platform_id')
.leftJoin('game_genres_join', 'games.game_id', 'game_genres_join.game_id')
.leftJoin('genres', 'game_genres_join.genre_id', 'genres.genre_id')
.leftJoin('game_subscriptions_join', 'games.game_id', 'game_subscriptions_join.game_id')
.leftJoin('subscription_services', 'game_subscriptions_join.service_id', 'subscription_services.service_id')
.leftJoin('game_developers_join', 'games.game_id', 'game_developers_join.game_id')
.leftJoin('developers', 'game_developers_join.developer_id', 'developers.developer_id')
.leftJoin('game_publishers_join', 'games.game_id', 'game_publishers_join.game_id')
.leftJoin('publishers', 'game_publishers_join.publisher_id', 'publishers.publisher_id')
.select('games.game_id','games.name','games.description','games.image','games.release_date',
  knex.raw(` ( SELECT JSON_ARRAYAGG(JSON_OBJECT('developer_id', dev.developer_id, 'name', dev.name)) FROM developers dev JOIN game_developers_join ON game_developers_join.developer_id = dev.developer_id WHERE game_developers_join.game_id = games.game_id GROUP BY game_developers_join.game_id ) as developers `), 
  knex.raw(` ( SELECT JSON_ARRAYAGG(JSON_OBJECT('publisher_id', pub.publisher_id, 'name', pub.name)) FROM publishers pub JOIN game_publishers_join ON game_publishers_join.publisher_id = pub.publisher_id WHERE game_publishers_join.game_id = games.game_id GROUP BY game_publishers_join.game_id ) as publishers `), 
  knex.raw(` ( SELECT JSON_ARRAYAGG(JSON_OBJECT('platform_id', plat.platform_id, 'name', plat.name)) FROM platforms plat JOIN game_platforms_join ON game_platforms_join.platform_id = plat.platform_id WHERE game_platforms_join.game_id = games.game_id GROUP BY game_platforms_join.game_id ) as platforms `), 
  knex.raw(` ( SELECT JSON_ARRAYAGG(JSON_OBJECT('genre_id', genres.genre_id, 'name', genres.name)) FROM genres JOIN game_genres_join ON game_genres_join.genre_id = genres.genre_id WHERE game_genres_join.game_id = games.game_id GROUP BY game_genres_join.game_id ) as genres `), 
  knex.raw(` ( SELECT JSON_ARRAYAGG(JSON_OBJECT('service_id', subs.service_id, 'name', subs.name)) FROM subscription_services subs JOIN game_subscriptions_join ON game_subscriptions_join.service_id = subs.service_id WHERE game_subscriptions_join.game_id = games.game_id GROUP BY game_subscriptions_join.game_id ) as subscription_services `) );

  const searchQuery = async (searchTerm, fields, values, limit, offset) => {
    const query = baseQuery.clone()
      .where(function() {
        this.where('games.name', 'like', `%${searchTerm}%`)
          .orWhere('games.description', 'like', `%${searchTerm}%`)
          .orWhere('developers.name', 'like', `%${searchTerm}%`)
          .orWhere('publishers.name', 'like', `%${searchTerm}%`)
          .orWhere('platforms.name', 'like', `%${searchTerm}%`)
          .orWhere('genres.name', 'like', `%${searchTerm}%`)
          .orWhere('subscription_services.name', 'like', `%${searchTerm}%`);
      });
  
    fields.forEach((field, index) => {
      query.andWhere(field, values[index]);
    });
  
    query
      .groupBy('games.game_id')
      .orderByRaw(`
        CASE
          WHEN games.name LIKE ? THEN 1
          WHEN games.name LIKE ? THEN 2
          ELSE 3
        END`, [`${searchTerm}`, `%${searchTerm}%`])
      .orderBy('games.name')
      .limit(limit)
      .offset(offset);
  
  
    let response = await query;
    return response;
  };
  

app.get('/search/:term', async (req, res) => {
  try {
    const searchTerm = req.params.term;
    const games = await searchQuery(searchTerm);
    res.status(200).json(games);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Unable to search games data`,
    });
  }
});
