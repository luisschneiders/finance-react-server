const bookshelf = require('../config/bookshelf');

const Bank = bookshelf.Model.extend({
    tableName: 'banks',
    hasTimestamps: true,
  },{
    getAllBanks: function(user, params) {
      return this.where('bankInsertedBy', user).fetchPage({
        page: params.page <= 0 ? params.page = 1 : params.page,
        pageSize: params.pageSize <= 0 ? params.pageSize = 12 : params.pageSize
      });
    },
    getActiveBanks: function(user) {
      return this.where({'bankInsertedBy': user, 'bankIsActive': 1}).fetchAll();
    },
    getById: function(user, bank) {
      return this.where({'bankInsertedBy': user, 'id': bank}).fetch();
    },
    updateBalance: function(data) {
      return this.update(function(qr) {
        qr.where({'bankInsertedBy': data.purchaseInsertedBy, 'id': data.purchaseBank, 'bankCurrentBalance': data.purchaseAmount});
      })
    }
  });

module.exports = Bank;
