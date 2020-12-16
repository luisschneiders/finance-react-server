
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('timesheets', function(table) {
      table.increments();
      table.integer('timesheetInsertedBy').notNullable();
      table.integer('timesheetEmployer').notNullable();
      table.datetime('timesheetStartDate').notNullable();
      table.datetime('timesheetEndDate').notNullable();
      table.time('timesheetTimeIn').notNullable();
      table.time('timesheetTimeOut').notNullable();
      table.time('timesheetTimeBreak');
      table.decimal('timesheetHourly', [4],[2]).notNullable();
      table.decimal('timesheetTotal', [10],[2]).notNullable();
      table.time('timesheetTotalHours');
      table.string('timesheetStatus', [1]).notNullable();
      table.string('timesheetFlag', [1]).notNullable();
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
};
