exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('purchase', function(table) {
      table.string('purchaseAddress');
      table.float('purchaseLatitude', [10], [6]);
      table.float('purchaseLongitude', [10], [6]);
    })
  ]);
};

exports.down = function(knex, Promise) {};
