const People = require('../models/People');

/**
 * GET /get-all-people/page=:page&pageSize=:pageSize
 */
exports.getAllPeople = function(req, res) {
  let params = {
    page: req.params.page,
    pageSize: req.params.pageSize
  };
  People.getAllPeople(req.user.id, params)
    .then(function(people) {
      res.send(JSON.stringify({people: people, pagination: people.pagination}));
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /get-active-people
 */
exports.getActivePeople = function(req, res) {
  People.getActivePeople(req.user.id)
    .then(function(people) {
      res.json(people);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /people=:id
 */
exports.getPeopleById = function(req, res) {
  People.getById(req.user.id, req.params.id)
    .then(function(people) {
      res.json(people);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /get-people-by-role/role=:role
 */
exports.getPeopleByRole = function(req, res) {
  People.getByRole(req.user.id, req.params.role)
    .then(function(people) {
      res.json(people);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * SAVE /people-new
 * or
 * SAVE /people=:id
 */
exports.savePeople = function(req, res) {
  let people = null;
  let errors = null;
  let checkRecord = 0;

  req.assert('peopleDescription', 'Description cannot be blank').notEmpty();
  req.assert('peopleType', 'Type cannot be blank').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  checkRecord = new People({id: req.params.id});
  people = new People();

  if(!checkRecord.isNew()) {
    people.save({
        id: req.params.id,
        peopleInsertedBy: req.user.id,
        peopleDescription: req.body.peopleDescription,
        peopleRates: req.body.peopleRates,
        peopleType: req.body.peopleType,
        peopleIsActive: req.body.peopleIsActive,
      }, { patch: true })
      .then(function(model) {
        res.send({ people: model, msg: 'User has been updated.' });
      })
      .catch(function(err) {
        res.send({ msg: err });
      });
    return;
  }
  people.save({
      peopleInsertedBy: req.user.id,
      peopleDescription: req.body.peopleDescription,
      peopleRates: req.body.peopleRates,
      peopleType: req.body.peopleType,
      peopleIsActive: req.body.peopleIsActive,
    })
    .then(function(model) {
      res.send({ people: model, msg: 'User has been added.' });
    })
    .catch(function(err) {
      return res.status(400).send({ msg: err });
    });
};
