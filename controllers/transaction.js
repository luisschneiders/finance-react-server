const moment = require('moment');
const Transaction = require('../models/Transaction');
const Bank = require('../models/Bank');

/**
 * GET /get-all-transactions-month/:year-month
 */
exports.getAllTransactions = function(req, res) {
  let user = req.user.id;
  let period = req.params.period;
  let startDate = moment(period).startOf('month').format('YYYY-MM-DD');
  let endDate = moment(period).endOf('month').format('YYYY-MM-DD');

  Transaction.getAllTransactions(user, startDate, endDate)
    .then(function(transactions) {
      res.json(transactions);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /transactions-by-custom-search/:from&:to&:transactionType
 */
exports.getTransactionByCustomSearch = function(req, res) {
  let startDate = null;
  let endDate = null;
  let transactionType = null;

  startDate = req.params.from;
  endDate = req.params.to;
  transactionType = req.params.transactionType;

  Transaction.getTransactionByCustomSearch(req.user.id, startDate, endDate, transactionType)
    .then(function(transactions) {
      res.json(transactions);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * POST /transactions/new
 */
exports.saveTransaction = function(req, res) {
  let errors = null;

  req.body.transactionAmount = parseFloat(req.body.transactionAmount);
  req.assert('transactionDate', 'Date cannot be blank').notEmpty();
  req.assert('transactionType', 'Action cannot be blank').notEmpty();
  req.assert('transactionFromBank', 'Account From cannot be blank').notEmpty();
  req.assert('transactionComments', 'Comments cannot be blank').notEmpty();
  req.assert('transactionAmount', 'Amount cannot be blank').notEmpty();
  req.assert('transactionAmount', 'Amount cannot be zero').isFloat({min: 0.01});

  if (req.body.transactionType.transactionTypeAction == 'T') {
    req.assert('transactionToBank', 'Account To cannot be blank').notEmpty();
    if(req.body.transactionFromBank === req.body.transactionToBank) {
      res.status(400).send({msg: 'Accounts cannot be the same!'});
      return;
    }
  }

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  switch(req.body.transactionType.transactionTypeAction) {
    case 'C':
    case 'D':
      transaction(req.body.transactionType.transactionTypeAction, null);
      break;
    case 'T':
      transfer();
      break;
    default:
      res.status(400).send(error);
  }

  function updateBank(action) {
    let bankId = checkBankId(action);

    return new Promise(function(resolve, reject) {
      Bank.getById(req.user.id, bankId)
        .then(function() {
          let bank = new Bank();
          if (action == 'D') {
            if (parseFloat(this.attributes.bankCurrentBalance) < parseFloat(req.body.transactionAmount)) {
              reject({msg: 'Insufficient funds!'});
              return;
            }
          }
          bank.save({
              id: bankId,
              bankCurrentBalance: action == 'C' ? (this.attributes.bankCurrentBalance + req.body.transactionAmount) : (this.attributes.bankCurrentBalance - req.body.transactionAmount),
            }, { patch: true })
            .then(function(model) {
              resolve();
            }).catch(function(err) {
              reject(err);
            });
        }).catch(function(err) {
          reject(err);
        });
    });
  };

  function saveTransaction(action, transactionLink) {
    let bankId = checkBankId(action);

    return new Promise(function(resolve, reject) {
      let transaction = new Transaction();
      transaction.save({
        transactionLink: transactionLink,
        transactionDate: req.body.transactionDate,
        transactionFromBank: bankId,
        transactionToBank: 0,
        transactionType: req.body.transactionType.id,
        transactionAction: action,
        transactionLabel: req.body.transactionType.transactionTypeAction,
        transactionAmount: req.body.transactionAmount,
        transactionComments: req.body.transactionComments,
        transactionInsertedBy: req.user.id,
        transactionFlag: 'r'
      })
      .then(function(model) {
        resolve(model.id);
      }).catch(function(err) {
        reject(err);
      });
    });
  };

  function checkBankId(action) {
    if (req.body.transactionType.transactionTypeAction == 'C' || req.body.transactionType.transactionTypeAction == 'D') {
      return req.body.transactionFromBank;
    } else if (req.body.transactionType.transactionTypeAction == 'T') {
      if (action == 'D') {
        return req.body.transactionFromBank;
      } else if (action == 'C') {
        return req.body.transactionToBank;
      }
    } else {
      return 0;
    }
  }
  async function transaction(action, transactionLink) {
    try {
      await updateBank(action);
      await saveTransaction(action, transactionLink);
      res.status(200).send({msg: 'Transaction Saved!'})
    } catch(error) {
      console.error(error);
      res.status(400).send(error);
    }
  };

  async function transfer() {
    let transactionID = 0;
    try {
      await updateBank('D');
      transactionID = await saveTransaction('D', null);
      await updateBank('C');
      await saveTransaction('C', transactionID);
      res.status(200).send({msg: 'Transaction Saved!'})
    } catch(error) {
      console.error(error);
      res.status(400).send(error);
    }
  }
};
