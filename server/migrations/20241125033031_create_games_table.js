export async function up(knex) {
  return knex.schema.createTable('games', table => {
    table.increments('game_id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.string('image');
    table.date('release_date');
  });
}

export async function down(knex) {
  return knex.schema.dropTable('games');
}
