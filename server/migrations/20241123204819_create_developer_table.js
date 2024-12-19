export async function up(knex) {
    return knex.schema.createTable('developers', table => {
      table.increments('developer_id').primary();
      table.string('name').notNullable();
    });
  };
  
  export async function down(knex) {
    return knex.schema.dropTable('developers');
  };
