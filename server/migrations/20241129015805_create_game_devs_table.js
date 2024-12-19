export async function up(knex) {
    return knex.schema.createTable('game_developers_join', table => {
      table.increments('id').primary();
      table.integer('game_id').unsigned().notNullable();
      table.integer('developer_id').unsigned().notNullable();
      table.foreign('game_id').references('games.game_id').onDelete('CASCADE');
      table.foreign('developer_id').references('developers.developer_id').onDelete('CASCADE');
    });
  }
  
  export async function down(knex) {
    return knex.schema.dropTable('game_developers_join');
  }
  