export async function up(knex) {
    return knex.schema.createTable('game_genres_join', table => {
      table.integer('game_id').unsigned().references('game_id').inTable('games').onDelete('CASCADE').index();
      table.integer('genre_id').unsigned().references('genre_id').inTable('genres').onDelete('CASCADE').index();
      table.primary(['game_id', 'genre_id']);
    });
  };
  
  export async function down(knex) {
    return knex.schema.dropTable('game_genres_join');
  };
