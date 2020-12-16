var config = require('../knexfile');
var knex = require('knex')(config);
var bookshelf = require('bookshelf')(knex);

bookshelf.plugin('bookshelf-virtuals-plugin');
// bookshelf.plugin('visibility');
// bookshelf.plugin('pagination');

knex.migrate.latest();

module.exports = bookshelf;
