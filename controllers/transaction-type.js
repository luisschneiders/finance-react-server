const TransactionType = require('../models/Transaction-Type');

/**
 * GET /get-transactions-type/page=:page&pageSize=:pageSize
 */
exports.getAllTransactionsType = function(req, res) {
  let params = {
    page: req.params.page,
    pageSize: req.params.pageSize
  };
  TransactionType.getAllTransactionsType(req.user.id, params)
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
  TransactionType.getById(req.user.id, req.params.id)
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
  let transactionType = null;
  let errors = null;
  let checkRecord = 0;

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
      transactionTypeInsertedBy: req.user.id,
      transactionTypeDescription: req.body.transactionTypeDescription,
      transactionTypeAction: req.body.transactionTypeAction,
      transactionTypeIsActive: req.body.transactionTypeIsActive,
    }, { patch: true })
      .then(function(model) {
        res.send({ transactionType: model, msg: 'Transaction type has been updated.' });
      })
      .catch(function(err) {
        res.send({ msg: err });
      });
    return;
  }
  transactionType.save({
      transactionTypeInsertedBy: req.user.id,
      transactionTypeDescription: req.body.transactionTypeDescription,
      transactionTypeAction: req.body.transactionTypeAction,
      transactionTypeIsActive: req.body.transactionTypeIsActive,
    })
    .then(function(model) {
      res.send({ transactionType: model, msg: 'Transaction type has been added.' });
    })
    .catch(function(err) {
      return res.status(400).send({ msg: err });
    });
};