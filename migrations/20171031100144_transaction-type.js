exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('transaction-type', function(table) {
      table.increments();
      table.string('transactionTypeDescription').notNullable();
      table.string('transactionTypeAction', [1]).notNullable();
      table.boolean('transactionTypeIsActive').defaultTo(1);
      table.integer('transactionTypeInsertedBy').notNullable();
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
};
