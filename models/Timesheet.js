const bookshelf = require('../config/bookshelf');

const Timesheets = bookshelf.Model.extend({
    tableName: 'timesheets',
    hasTimestamps: true,
  },{
    getAllTimesheetsByMonth: function(user, startDate, endDate) {
      return this.query(function(qr) {
        qr.select('people.peopleDescription', 'timesheets.*');
        qr.leftJoin('people', 'timesheets.timesheetEmployer', '=', 'people.id');
        qr.where({'timesheetInsertedBy': user, 'timesheetFlag': 'r'});
        qr.whereBetween('timesheetStartDate', [startDate, endDate]);
      }).fetchAll();
    },
    getAllTimesheetByYear: function(user, startDate, endDate) {
      return this.query(function(qr) {
        qr.select('timesheetTotalHours');
        qr.where({'timesheetInsertedBy': user, 'timesheetFlag': 'r'});
        qr.whereBetween('timesheetStartDate', [startDate, endDate]);
      }).fetchAll();
    }
  });

module.exports = Timesheets;
