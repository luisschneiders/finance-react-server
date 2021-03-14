var Vehicle = require('../models/Vehicle');

/**
 * GET /get-all-vehicles/page=:page&pageSize=:pageSize
 */
exports.getAllVehicles = function(req, res) {
  var id = req.params.id;
  var params = {
    page: req.params.page,
    pageSize: req.params.pageSize
  };
  Vehicle.getAllVehicles(id, params)
    .then(function(vehicles) {
      res.send(JSON.stringify({ vehicles, pagination: vehicles.pagination }));
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /get-active-vehicles
 */
exports.getActiveVehicles = function(req, res) {
  Vehicle.getActiveVehicles(req.user.id)
    .then(function(vehicles) {
      res.json(vehicles);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /vehicle-id=:id
 */
exports.getVehicleById = function(req, res) {
  var userId = req.params.vehicleInsertedBy;
  var vehicleId = req.params.id;

  Vehicle.getById(userId, vehicleId)
    .then(function(vehicle) {
      res.json(vehicle);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * SAVE /vehicle-new
 * or
 * SAVE /vehicle-id=:id
 */
exports.saveVehicle = function(req, res) {
  var vehicle = null;
  var errors = null;
  var checkRecord = 0;
  var vehicleInsertedBy = req.params.vehicleInsertedBy;

  req.assert('vehicleDescription', 'Description cannot be blank').notEmpty();
  req.assert('vehiclePlate', 'Plate cannot be blank').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  checkRecord = new Vehicle({id: req.params.id});
  vehicle = new Vehicle();

  if(!checkRecord.isNew()) {
    vehicle.save({
        id: req.params.id,
        vehicleInsertedBy: vehicleInsertedBy,
        vehicleDescription: req.body.vehicleDescription,
        vehiclePlate: req.body.vehiclePlate,
        vehicleIsActive: req.body.vehicleIsActive,
      }, { patch: true })
      .then(function(model) {
        res.send({ vehicle: model, msg: 'Vehicle has been updated.' });
      })
      .catch(function(err) {
        res.send({ msg: err });
      });
    return;
  }
  vehicle.save({
    vehicleInsertedBy: vehicleInsertedBy,
    vehicleDescription: req.body.vehicleDescription,
    vehiclePlate: req.body.vehiclePlate,
    vehicleIsActive: req.body.vehicleIsActive,
  })
  .then(function(model) {
    res.send({ vehicle: model, msg: 'Vehicle has been added.' });
  })
  .catch(function(err) {
    return res.status(400).send({ msg: err });
  });
};
