exports.up = function(knex) {
  return knex.schema.createTable('trip', function(table) {
      table.increments();
      table.integer('tripVehicle').notNullable();
      table.date('tripDate').notNullable();
      table.decimal('tripDistance', [4],[1]);
      table.integer('tripInsertedBy').notNullable();
      table.string('tripFlag', [1]).notNullable();
      table.timestamps();
    });
};

exports.down = function(knex) {
};
