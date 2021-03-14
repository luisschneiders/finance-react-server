var TransactionType = require('../models/Transaction-Type');

/**
 * GET /get-transactions-type/page=:page&pageSize=:pageSize
 */
exports.getAllTransactionsType = function(req, res) {
  var id = req.params.id;
  var params = {
    page: req.params.page,
    pageSize: req.params.pageSize
  };
  TransactionType.getAllTransactionsType(id, params)
  .then(function(transactionsType) {
    res.send(JSON.stringify({ transactionsType, pagination: transactionsType.pagination }));
  }).catch(function(err) {
    console.error(err);
  });
};

/**
 * GET /get-active-transactions-type
 */
exports.getActiveTransactionsType = function(req, res) {
  TransactionType.getActiveTransactionsType(req.user.id)
    .then(function(transactionsType) {
      res.json(transactionsType);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /transactions-type=:id
 */
exports.getTransactionTypeById = function(req, res) {
  var userId = req.params.transactionTypeInsertedBy;
  var transactionTypeId = req.params.id;

  TransactionType.getById(userId, transactionTypeId)
  .then(function(transactionType) {
    res.json(transactionType);
  }).catch(function(err) {
    console.error(err);
  });
};

/**
 * SAVE /transactions-type-new
 * or
 * SAVE /transactions-type=:id
 */
exports.saveTransactionType = function(req, res) {
  var transactionType = null;
  var errors = null;
  var checkRecord = 0;
  var transactionTypeInsertedBy = req.params.transactionTypeInsertedBy;

  req.assert('transactionTypeDescription', 'Description cannot be blank').notEmpty();
  req.assert('transactionTypeAction', 'Type cannot be blank').notEmpty();
  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  checkRecord = new TransactionType({id: req.params.id});
  transactionType = new TransactionType();

  if(!checkRecord.isNew()) {
    transactionType.save({
      id: req.params.id,
      transactionTypeInsertedBy: transactionTypeInsertedBy,
      transactionTypeDescription: req.body.transactionTypeDescription,
      transactionTypeAction: req.body.transactionTypeAction,
      transactionTypeIsActive: req.body.transactionTypeIsActive,
    }, { patch: true })
      .then(function(model) {
        res.send({ transactionType: model, msg: 'Transaction category has been updated.' });
      })
      .catch(function(err) {
        res.send({ msg: err });
      });
    return;
  }
  transactionType.save({
      transactionTypeInsertedBy: transactionTypeInsertedBy,
      transactionTypeDescription: req.body.transactionTypeDescription,
      transactionTypeAction: req.body.transactionTypeAction,
      transactionTypeIsActive: req.body.transactionTypeIsActive,
    })
    .then(function(model) {
      res.send({ transactionType: model, msg: 'Transaction category has been added.' });
    })
    .catch(function(err) {
      return res.status(400).send({ msg: err });
    });
};
