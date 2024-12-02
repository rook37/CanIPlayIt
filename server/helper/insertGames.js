import fs from 'fs';
import knex from 'knex';
import knexConfig from '../knexfile.js';

const knexInstance = knex(knexConfig.development);

const genreSet = new Set();
const platformSet = new Set();
const subscriptionSet = new Set();
const developerSet = new Set();
const publisherSet = new Set();

const games = JSON.parse(fs.readFileSync('data/games.json', 'utf-8')); 

for (const game of games) {
    game.genre.forEach(genre => genreSet.add(genre));
    game.platforms.forEach(platform => platformSet.add(platform));
    game.subscriptions.forEach(subscription => subscriptionSet.add(subscription));
    game.developers.forEach(developer => developerSet.add(developer));
    game.publishers.forEach(publisher => publisherSet.add(publisher));
}

async function insertUniqueValues(knex, table, values) {
    for (const value of values) {
        await knex(table).insert({ name: value }).onConflict('name').ignore();
    }
}

async function insert() {
    await insertUniqueValues(knexInstance, 'genres', genreSet);
    await insertUniqueValues(knexInstance, 'platforms', platformSet);
    await insertUniqueValues(knexInstance, 'subscription_services', subscriptionSet);
    await insertUniqueValues(knexInstance, 'developers', developerSet);
    await insertUniqueValues(knexInstance, 'publishers', publisherSet);

    for (const game of games) {
        await insertGame(knexInstance, game);
    }
    console.log('Database loaded!');
    await knexInstance.destroy(); 
}

async function insertGame(knex, game) {
    const gameIdResult = await knex('games').insert({
        name: game.title,
        description: game.description,
        image: game.image,
        release_date: game.release_date.split('T')[0] 
    });

    const gameId = gameIdResult[0];
    

    for (const genre of game.genre) {
        const genreObj = await knex('genres').select('genre_id').where({ name: genre }).first();
        try{
        await knex('game_genres_join').insert({ game_id: gameId, genre_id: genreObj.genre_id });
        }catch(er){console.log(er);console.log(genre);console.log(game)}
    }

    for (const platform of game.platforms) {
        const platformObj = await knex('platforms').select('platform_id').where({ name: platform }).first();
        await knex('game_platforms_join').insert({ game_id: gameId, platform_id: platformObj.platform_id });
    }

    for (const subscription of game.subscriptions) {
        const serviceObj = await knex('subscription_services').select('service_id').where({ name: subscription }).first();
        await knex('game_subscriptions_join').insert({ game_id: gameId, service_id: serviceObj.service_id });
    }

    for (const developer of game.developers) {
        const developerObj = await knex('developers').select('developer_id').where({ name: developer }).first();
        await knex('game_developers_join').insert({ game_id: gameId, developer_id: developerObj.developer_id });
    }

    for (const publisher of game.publishers) {
        const publisherObj = await knex('publishers').select('publisher_id').where({ name: publisher }).first();
        await knex('game_publishers_join').insert({ game_id: gameId, publisher_id: publisherObj.publisher_id });
    }
}

insert();
