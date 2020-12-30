var Purchase = require('../models/Purchase');
var Transaction = require('../models/Transaction');
var Bank = require('../models/Bank');
var Timesheet = require('../models/Timesheet');
var async = require('async');
/**
 * GET /main-by-year/:id&:year
 */
exports.getTransactionsAndPurchasesByYear = function(req, res) {

  var year = req.params.year;
  var user = req.params.id;

  var startDate = `${year}-01-01`;
  var endDate = `${year}-12-31`;

  async.parallel([
    function(callback) {
      Transaction.getTransactionByYear(user, startDate, endDate)
      .then(function(transactions) {
        callback(null, transactions);
      }).catch(function(err) {
        console.error(err);
      });
    },
    function(callback) {
      Purchase.getPurchaseByYear(user, startDate, endDate)
      .then(function(purchases) {
        callback(null, purchases);
      }).catch(function(err) {
        console.error(err);
      });
    },
    function(callback) {
      Transaction.getIncomeByYear(user, startDate, endDate)
      .then(function(transactions) {
        callback(null, transactions);
      }).catch(function(err) {
        console.error(err);
      });
    },
    function(callback) {
      Bank.getActiveBanks(user)
      .then(function(banks) {
        callback(null, banks);
      }).catch(function(err) {
        console.error(err);
      });
    },
    function(callback) {
      Purchase.getPurchaseByExpenseTypeAndYear(user, startDate, endDate)
      .then(function(purchases) {
        callback(null, purchases);
      }).catch(function(err) {
        console.error(err);
      });
    },
    function(callback) {
      Timesheet.getAllTimesheetByYear(user, startDate, endDate)
      .then(function(timesheets) {
        callback(null, timesheets)
      }).catch(function(err) {
        console.log(err);
      });
    }
  ], function(err, results) {
      res.json(results);
  });  
};
