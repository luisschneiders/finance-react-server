var bookshelf = require('../config/bookshelf');

var ExpenseType = bookshelf.Model.extend({
    tableName: 'expense-type',
    hasTimestamps: true,
  },{
    getAllExpensesType: function(user, params) {
      return this.where('expenseTypeInsertedBy', user).orderBy('id', 'DESC').fetchPage({
        page: params.page <= 0 ? params.page = 1 : params.page,
        pageSize: params.pageSize <= 0 ? params.pageSize = 12 : params.pageSize
      });
    },
    getActiveExpensesType: function(user) {
      return this.where({'expenseTypeInsertedBy': user, 'expenseTypeIsActive': 1}).orderBy('expenseTypeDescription', 'ASC').fetchAll();
    },
    getById: function(user, expenseType) {
      return this.where({'expenseTypeInsertedBy': user, 'id': expenseType}).fetch();
    }
  });

module.exports = ExpenseType;
