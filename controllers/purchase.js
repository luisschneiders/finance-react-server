var moment = require('moment');
var async = require('async');
var Bank = require('../models/Bank');
var Purchase = require('../models/Purchase');
var Transaction = require('../models/Transaction');

/**
 * GET /purchases-by-custom-search/:id&:from&:to&:expenseType
 */
exports.getPurchasesByCustomSearch = function(req, res) {
  var id = req.params.id;
  var startDate = req.params.from;
  var endDate = req.params.to;
  var expenseType = req.params.expenseType;

  Purchase.getPurchaseByCustomSearch(id, startDate, endDate, expenseType)
    .then(function(purchases) {
      res.json(purchases);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * POST /purchases/new
 */
exports.savePurchase = function(req, res) {
  var errors = null;

  req.body.purchaseAmount = parseFloat(req.body.purchaseAmount);
  req.assert('purchaseBank', 'Bank cannot be blank').notEmpty();
  req.assert('purchaseExpenseId', 'Expense cannot be blank').notEmpty();
  req.assert('purchaseDate', 'Date cannot be blank').notEmpty();
  req.assert('purchaseComments', 'Comments cannot be blank').notEmpty();
  req.assert('purchaseAmount', 'Amount cannot be blank').notEmpty();
  req.assert('purchaseAmount', 'Amount cannot be zero').isFloat({min: 0.01});

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  function updateBankBalance() {
    return new Promise(function(resolve, reject) {
      Bank.getById(req.user.id, req.body.purchaseBank)
        .then(function() {
          var bank = new Bank();
          // check if there is enough funds
          if (parseFloat(this.attributes.bankCurrentBalance) < parseFloat(req.body.purchaseAmount)) {
            reject({msg: 'Insufficient funds!'});
            return;
          }
          // update bank's current balance
          bank.save({
              id: req.body.purchaseBank,
              bankCurrentBalance: (this.attributes.bankCurrentBalance - req.body.purchaseAmount),
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

  function saveTransaction() {
    return new Promise(function(resolve, reject) {
      var transaction = new Transaction();
      transaction.save({
        transactionLink: null,
        transactionDate: req.body.purchaseDate,
        transactionFromBank: req.body.purchaseBank,
        transactionToBank: 0,
        transactionType: 0, // purchase
        transactionAction: 'D',
        transactionLabel: 'D',
        transactionAmount: req.body.purchaseAmount,
        transactionComments: req.body.purchaseComments,
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

  function savePurchase(transactionID) {
    return new Promise(function(resolve, reject) {
      var purchase =  new Purchase();
      purchase.save({
        purchaseDate: req.body.purchaseDate,
        purchaseBank: req.body.purchaseBank,
        purchaseExpenseId: req.body.purchaseExpenseId,
        purchaseAmount: req.body.purchaseAmount,
        purchaseComments: req.body.purchaseComments,
        purchaseTransactionId: transactionID,
        purchaseInsertedBy: req.user.id,
        purchaseFlag: 'r',
        purchaseAddress: req.body.purchaseAddress,
        purchaseLatitude: req.body.latitude,
        purchaseLongitude: req.body.longitude
      })
      .then(function(model) {
        resolve();
      }).catch(function(err) {
        reject(err);
      });
    });
  };

  async function transaction() {
    var transactionID = 0;
    try {
      await updateBankBalance();
      transactionID = await saveTransaction();
      await savePurchase(transactionID);
      res.status(200).send({msg: 'Purchase Saved!'})
    } catch(error) {
      console.error(error);
      res.status(400).send(error);
    }
  }
  transaction();
};
