export async function up(knex) {
  return knex.schema.createTable('subscription_services', table => {
    table.increments('service_id').primary();
    table.string('name').notNullable();
    table.text('description');
  });
};

export async function down(knex) {
  return knex.schema.dropTable('subscription_services');
};
