const developers = [
  { developer_id: 1, name: "Developer A" },
  { developer_id: 2, name: "Developer B" },
  { developer_id: 3, name: "Developer C" }
];

const publishers = [
  { publisher_id: 1, name: "Publisher A" },
  { publisher_id: 2, name: "Publisher B" },
  { publisher_id: 3, name: "Publisher C" }
];

const platforms = [
  { platform_id: 1, name: "PC" },
  { platform_id: 2, name: "Xbox One" },
  { platform_id: 3, name: "Xbox Series X/S" }
];

const genres = [
  { genre_id: 1, name: "Action" },
  { genre_id: 2, name: "Puzzle" },
  { genre_id: 3, name: "Racing" }
];

const games = [
  {
    game_id: 1,
    name: "Game A",
    description: "An exciting adventure game.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1lat.jpg", 
    release_date: "2022-10-01"
  },
  {
    game_id: 2,
    name: "Game B",
    description: "A challenging puzzle game.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1lat.jpg",
    release_date: "2022-11-15"
  },
  {
    game_id: 3,
    name: "Game C",
    description: "A thrilling racing game.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1lat.jpg",
    release_date: "2023-01-10"
  }
];

const subscriptionServices = [
  { service_id: 1, name: "Game Pass Core", description: "Core subscription service" },
  { service_id: 2, name: "Game Pass Standard", description: "Standard subscription service" },
  { service_id: 3, name: "Game Pass PC", description: "PC subscription service" }
];

const gamePlatforms = [
  { game_id: 1, platform_id: 1 },
  { game_id: 1, platform_id: 2 },
  { game_id: 2, platform_id: 1 },
  { game_id: 3, platform_id: 2 },
  { game_id: 3, platform_id: 3 }
];

const gameGenres = [
  { game_id: 1, genre_id: 1 },
  { game_id: 2, genre_id: 2 },
  { game_id: 3, genre_id: 3 }
];

const gameSubscriptions = [
  { game_id: 1, service_id: 1 },
  { game_id: 2, service_id: 2 },
  { game_id: 3, service_id: 3 }
];

const gameDevs = [
  { game_id:1, developer_id:1},
  { game_id:1, developer_id:2},
  { game_id:2, developer_id:2},
  { game_id:3, developer_id:3},
]

const gamePubs = [
  { game_id:1, publisher_id:1},
  { game_id:1, publisher_id:2},
  { game_id:2, publisher_id:2},
  { game_id:3, publisher_id:3},
]

export async function seed(knex) {
  // delete all existing entries
  await knex('developers').del()
  await knex('publishers').del()
  await knex('platforms').del()
  await knex('genres').del()  
  await knex('games').del()
  await knex('subscription_services').del()
  await knex('game_platforms_join').del()
  await knex('game_genres_join').del()
  await knex('game_subscriptions_join').del()
  await knex('game_developers_join').del();
  await knex('game_publishers_join').del();

  // insert new seed
  await knex('developers').insert(developers);
  await knex('publishers').insert(publishers);
  await knex('platforms').insert(platforms);
  await knex('genres').insert(genres);
  await knex('games').insert(games);
  await knex('subscription_services').insert(subscriptionServices);
  await knex('game_platforms_join').insert(gamePlatforms);
  await knex('game_genres_join').insert(gameGenres);
  await knex('game_subscriptions_join').insert(gameSubscriptions);
  await knex('game_developers_join').insert(gameDevs);
  await knex('game_publishers_join').insert(gamePubs);
};
