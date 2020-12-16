const bookshelf = require('../config/bookshelf');

const Trip = bookshelf.Model.extend({
    tableName: 'trip',
    hasTimestamps: true,
  },{
    getAllTripsByMonth: function(user, startDate, endDate) {
      return this.query(function(qr) {
        qr.select('vehicle.vehicleDescription', 'vehicle.vehiclePlate', 'trip.*');
        qr.leftJoin('vehicle', 'trip.tripVehicle', '=', 'vehicle.id');
        qr.where({'tripInsertedBy': user, 'tripFlag': 'r'});
        qr.whereBetween('tripDate', [startDate, endDate]);
      }).fetchAll();
    }
  });

module.exports = Trip;
