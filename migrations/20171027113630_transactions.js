exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('transactions', function(table){
      table.increments();
      table.integer('transactionLink');
      table.date('transactionDate').notNullable();
      table.integer('transactionFromBank').notNullable();
      table.integer('transactionToBank').defaultTo(0);
      table.integer('transactionType').notNullable();
      table.string('transactionAction', [1]).notNullable();
      table.string('transactionLabel', [1]).notNullable();
      table.decimal('transactionAmount', [10],[2]).notNullable();
      table.string('transactionComments');
      table.integer('transactionInsertedBy').notNullable();
      table.string('transactionFlag', [1]).notNullable();
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
};
