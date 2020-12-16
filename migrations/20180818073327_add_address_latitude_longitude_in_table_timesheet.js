exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('timesheets', function(table) {
      table.string('timesheetAddress');
      table.float('timesheetLatitude', [10], [6]);
      table.float('timesheetLongitude', [10], [6]);
    })
  ]);
};

exports.down = function(knex, Promise) {};
