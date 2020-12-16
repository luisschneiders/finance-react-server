exports.up = function(knex) {
  return knex.schema.createTable('vehicle', function(table) {
    table.increments();
    table.string('vehicleDescription').notNullable();
    table.string('vehiclePlate').notNullable();
    table.boolean('vehicleIsActive').defaultTo(1);
    table.integer('vehicleInsertedBy').notNullable();
    table.timestamps();
  });
};

exports.down = function(knex) {
};
