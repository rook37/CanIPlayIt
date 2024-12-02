export async function up(knex) {
    return knex.schema.createTable('genres', table => {
      table.increments('genre_id').primary();
      table.string('name').notNullable();
    });
  };
  
  export async function down(knex) {
    return knex.schema.dropTable('genres');
  };
