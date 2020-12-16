const bookshelf = require('../config/bookshelf');

const Vehicle = bookshelf.Model.extend({
    tableName: 'vehicle',
    hasTimestamps: true,
  },{
    getAllVehicles: function(user, params) {
      return this.where('vehicleInsertedBy', user).fetchPage({
        page: params.page <= 0 ? params.page = 1 : params.page,
        pageSize: params.pageSize <= 0 ? params.pageSize = 12 : params.pageSize
      });
    },
    getActiveVehicles: function(user) {
      return this.where({'vehicleInsertedBy': user, 'vehicleIsActive': 1}).fetchAll();
    },
    getById: function(user, vehicle) {
      return this.where({'vehicleInsertedBy': user, 'id': vehicle}).fetch();
    },
  });

module.exports = Vehicle;
