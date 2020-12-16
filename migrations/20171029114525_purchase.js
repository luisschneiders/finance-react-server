exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('purchase', function(table) {
      table.increments();
      table.date('purchaseDate').notNullable();
      table.integer('purchaseBank').notNullable();
      table.integer('purchaseExpenseId').notNullable();
      table.decimal('purchaseAmount', [10], [2]).notNullable();
      table.string('purchaseComments').notNullable();
      table.integer('purchaseTransactionId').notNullable();
      table.integer('purchaseInsertedBy').notNullable();
      table.string('purchaseFlag', [1]).notNullable();
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
};
