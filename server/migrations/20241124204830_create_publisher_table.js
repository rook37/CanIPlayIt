export async function up(knex) {
    return knex.schema.createTable('publishers', table => {
      table.increments('publisher_id').primary();
      table.string('name').notNullable();
    });
  };
  
  export async function down(knex) {
    return knex.schema.dropTable('publishers');
  };
