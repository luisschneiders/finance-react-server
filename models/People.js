const bookshelf = require('../config/bookshelf');

const People = bookshelf.Model.extend({
    tableName: 'people',
    hasTimestamps: true,
  },{
    getAllPeople: function(user, params) {
      return this.where('peopleInsertedBy', user).fetchPage({
        page: params.page <= 0 ? params.page = 1 : params.page,
        pageSize: params.pageSize <= 0 ? params.pageSize = 12 : params.pageSize
      });
    },
    getActivePeople: function(user) {
      return this.where({'peopleInsertedBy': user, 'peopleIsActive': 1}).fetchAll();
    },
    getById: function(user, people) {
      return this.where({'peopleInsertedBy': user, 'id': people}).fetch();
    },
    getByRole: function(user, role) {
      return this.where({'peopleInsertedBy': user, 'peopleType': role, 'peopleIsActive': 1}).fetchAll();
    }
  });

module.exports = People;
