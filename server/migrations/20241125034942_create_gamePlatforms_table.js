// migrations/20231124214800_create_game_platforms_table.js
export async function up(knex) {
  await knex.schema.createTable('game_platforms_join', table => {
    table.integer('game_id').unsigned().references('game_id').inTable('games').onDelete('CASCADE').index();
    table.integer('platform_id').unsigned().references('platform_id').inTable('platforms').onDelete('CASCADE').index();
    table.primary(['game_id', 'platform_id']);
  });
};

export async function down(knex) {
  await knex.schema.dropTable('game_platforms_join');
};
