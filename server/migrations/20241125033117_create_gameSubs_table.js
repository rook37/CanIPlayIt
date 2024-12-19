export async function up(knex) {
  return knex.schema.createTable('game_subscriptions_join', table => {
    table.integer('game_id').unsigned().references('game_id').inTable('games').onDelete('CASCADE').index();
    table.integer('service_id').unsigned().references('service_id').inTable('subscription_services').onDelete('CASCADE').index();
    table.primary(['game_id', 'service_id']);
  });
};

export async function down(knex) {
  return knex.schema.dropTable('game_subscriptions_join');
};
