var People = require('../models/People');

/**
 * GET /get-all-user-type/page=:page&pageSize=:pageSize
 */
exports.getAllPeople = function(req, res) {
  var id = req.params.id;
  var params = {
    page: req.params.page,
    pageSize: req.params.pageSize
  };
  People.getAllPeople(id, params)
    .then(function(usersType) {
      res.send(JSON.stringify({usersType, pagination: usersType.pagination}));
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /get-active-user-type
 */
exports.getActivePeople = function(req, res) {
  People.getActivePeople(req.user.id)
    .then(function(userType) {
      res.json(userType);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /user-type=:id
 */
exports.getPeopleById = function(req, res) {
  var userId = req.params.userTypeInsertedBy;
  var userTypeId = req.params.id;

  People.getById(userId, userTypeId)
    .then(function(userType) {
      res.json(userType);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /get-user-type-by-role/role=:role
 */
exports.getPeopleByRole = function(req, res) {
  var userId = req.params.userTypeInsertedBy;
  var role = req.params.role;

  People.getByRole(userId, role)
    .then(function(userType) {
      res.json(userType);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * SAVE /user-type-new
 * or
 * SAVE /user-type=:id
 */
exports.savePeople = function(req, res) {
  var people = null;
  var errors = null;
  var checkRecord = 0;
  var userTypeInsertedBy = req.params.userTypeInsertedBy;

  req.assert('userTypeDescription', 'Description cannot be blank').notEmpty();
  req.assert('userTypeOptions', 'Type cannot be blank').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  checkRecord = new People({id: req.params.id});
  people = new People();

  if(!checkRecord.isNew()) {
    people.save({
        id: req.params.id,
        peopleInsertedBy: userTypeInsertedBy,
        peopleDescription: req.body.userTypeDescription,
        peopleRates: req.body.userTypeRates,
        peopleType: req.body.userTypeOptions,
        peopleIsActive: req.body.userTypeIsActive,
      }, { patch: true })
      .then(function(model) {
        res.send({ userType: model, msg: 'User has been updated.' });
      })
      .catch(function(err) {
        res.send({ msg: err });
      });
    return;
  }
  people.save({
      peopleInsertedBy: userTypeInsertedBy,
      peopleDescription: req.body.userTypeDescription,
      peopleRates: req.body.userTypeRates,
      peopleType: req.body.userTypeOptions,
      peopleIsActive: req.body.userTypeIsActive,
    })
    .then(function(model) {
      res.send({ userType: model, msg: 'User has been added.' });
    })
    .catch(function(err) {
      return res.status(400).send({ msg: err });
    });
};
