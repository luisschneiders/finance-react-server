const Bank = require('../models/Bank');

/**
 * GET /get-all-banks/page=:page&pageSize=:pageSize
 */
exports.getAllBanks = function(req, res) {
  let params = {
    page: req.params.page,
    pageSize: req.params.pageSize
  };
  Bank.getAllBanks(req.user.id, params)
    .then(function(banks) {
      res.send(JSON.stringify({ banks, pagination: banks.pagination }));
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /get-active-banks
 */
exports.getActiveBanks = function(req, res) {
  Bank.getActiveBanks(req.user.id)
    .then(function(banks) {
      res.json(banks);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /bank-id=:id
 */
exports.getBankById = function(req, res) {
  Bank.getById(req.user.id, req.params.id)
    .then(function(bank) {
      res.json(bank);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * SAVE /bank-new
 * or
 * SAVE /bank-id=:id
 */
exports.saveBank = function(req, res) {
  let bank = null;
  let errors = null;
  let checkRecord = 0;

  req.assert('bankDescription', 'Description cannot be blank').notEmpty();
  req.assert('bankAccount', 'Account cannot be blank').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  checkRecord = new Bank({id: req.params.id});
  bank = new Bank();

  if(!checkRecord.isNew()) {
    bank.save({
        id: req.params.id,
        bankInsertedBy: req.user.id,
        bankDescription: req.body.bankDescription,
        bankAccount: req.body.bankAccount,
        bankCurrentBalance: req.body.bankCurrentBalance,
        bankIsActive: req.body.bankIsActive,
      }, { patch: true })
      .then(function(model) {
        res.send({ bank: model, msg: 'Bank has been updated.' });
      })
      .catch(function(err) {
        res.send({ msg: err });
      });
    return;
  }
  bank.save({
      bankInsertedBy: req.user.id,
      bankDescription: req.body.bankDescription,
      bankAccount: req.body.bankAccount,
      bankInitialBalance: req.body.bankCurrentBalance,
      bankCurrentBalance: req.body.bankCurrentBalance,
      bankIsActive: req.body.bankIsActive,
    })
    .then(function(model) {
      res.send({ bank: model, msg: 'Bank has been added.' });
    })
    .catch(function(err) {
      return res.status(400).send({ msg: err });
    });
};
