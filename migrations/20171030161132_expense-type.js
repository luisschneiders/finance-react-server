exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('expense-type', function(table) {
      table.increments();
      table.string('expenseTypeDescription').notNullable();
      table.boolean('expenseTypeIsActive').defaultTo(1);
      table.integer('expenseTypeInsertedBy').notNullable();
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
};
