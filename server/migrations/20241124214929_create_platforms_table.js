// migrations/20231124214700_create_platforms_table.js
export async function up(knex) {
  await knex.schema.createTable('platforms', table => {
    table.increments('platform_id').primary();
    table.string('name').notNullable().unique();
  });
};

export async function down(knex) {
  await knex.schema.dropTable('platforms');
};
