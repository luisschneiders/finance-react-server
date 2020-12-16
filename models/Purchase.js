const bookshelf = require('../config/bookshelf');

const Purchase = bookshelf.Model.extend({
    tableName: 'purchase',
    hasTimestamps: true
  },{
    getPurchaseByYear: function(user, startDate, endDate) {
      return this.query(function(qr) {
        qr.select('purchaseExpenseId', 'purchaseAmount', 'purchaseInsertedBy', 'purchaseDate');
        qr.sum('purchaseAmount AS TotalAmountByMonth');
        qr.where({'purchaseInsertedBy': user, 'purchaseFlag': 'r'});
        qr.whereBetween('purchaseDate', [startDate, endDate]);
        qr.groupByRaw('month (purchaseDate)');
      }).fetchAll();
    },
    getPurchaseByCustomSearch: function(user, startDate, endDate, expenseType) {
      let options = new Options(user, startDate, endDate);
      let refineExpenseType = [];
      let allExpensesType = 'all';

      refineExpenseType = expenseType.split(',');

      return this.query(function(qr) {
        queryPurchases(qr, options);
        if(expenseType !== allExpensesType){
          qr.whereIn('purchaseExpenseId', refineExpenseType);
        }
      }).fetchAll();
    },
    getPurchaseByExpenseTypeAndYear: function(user, startDate, endDate) {
      return this.query(function(qr) {
        qr.select('expense-type.expenseTypeDescription');
        qr.sum('purchaseAmount AS TotalAmountByExpensiveType');
        qr.leftJoin('expense-type', 'purchase.purchaseExpenseId', '=', 'expense-type.id');
        qr.where({'purchaseInsertedBy': user, 'purchaseFlag': 'r'});
        qr.whereBetween('purchaseDate', [startDate, endDate]);
        qr.groupByRaw('purchaseExpenseId');
      }).fetchAll();
    }
  });
class Options {
  constructor(user, startDate, endDate) {
    this.user = user;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

function queryPurchases(qr, options) {
  qr.select('expense-type.expenseTypeDescription', 'banks.bankDescription', 'purchase.id', 'purchaseExpenseId', 'purchaseAmount',
    'purchaseComments', 'purchaseDate', 'purchaseAddress', 'purchaseLatitude', 'purchaseLongitude');
  qr.leftJoin('expense-type', 'purchase.purchaseExpenseId', '=', 'expense-type.id');
  qr.leftJoin('banks', 'purchase.purchaseBank', '=', 'banks.id');
  qr.where({'purchaseInsertedBy': options.user, 'purchaseFlag': 'r'});
  qr.whereBetween('purchaseDate', [options.startDate, options.endDate]);
  return qr;
};

module.exports = Purchase;
