const bookshelf = require('../config/bookshelf');

const TransactionType = bookshelf.Model.extend({
    tableName: 'transaction-type',
    hasTimestamps: true,
  },{
    getAllTransactionsType: function(user, params) {
      return this.where('transactionTypeInsertedBy', user).fetchPage({
        page: params.page <= 0 ? params.page = 1 : params.page,
        pageSize: params.pageSize <= 0 ? params.pageSize = 12 : params.pageSize
      });
    },
    getActiveTransactionsType: function(user) {
      return this.where({'transactionTypeInsertedBy': user, 'transactionTypeIsActive': 1}).fetchAll();
    },
    getById: function(user, transactionType) {
      return this.where({'transactionTypeInsertedBy': user, 'id': transactionType}).fetch();
    }
  });

module.exports = TransactionType;
