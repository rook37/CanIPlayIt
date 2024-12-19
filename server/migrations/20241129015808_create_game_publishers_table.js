export async function up(knex) {
    return knex.schema.createTable('game_publishers_join', table => {
      table.increments('id').primary();
      table.integer('game_id').unsigned().notNullable();
      table.integer('publisher_id').unsigned().notNullable();
      table.foreign('game_id').references('games.game_id').onDelete('CASCADE');
      table.foreign('publisher_id').references('publishers.publisher_id').onDelete('CASCADE');
    });
  }
  
  export async function down(knex) {
    return knex.schema.dropTable('game_publishers_join');
  }
  