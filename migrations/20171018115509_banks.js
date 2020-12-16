exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('banks', function(table) {
      table.increments();
      table.string('bankDescription').notNullable();
      table.string('bankAccount').unique().notNullable();
      table.decimal('bankInitialBalance', [10],[2]);
      table.decimal('bankCurrentBalance', [10],[2]);
      table.boolean('bankIsActive').defaultTo(1);
      table.integer('bankInsertedBy').notNullable();
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
};
  