exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('people', function(table){
      table.increments();
      table.string('peopleDescription').notNullable();
      table.decimal('peopleRates', [10],[2]);
      table.integer('peopleType').notNullable();
      table.boolean('peopleIsActive').defaultTo(1);
      table.integer('peopleInsertedBy').notNullable();
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
};
