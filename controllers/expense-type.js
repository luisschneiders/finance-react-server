var ExpenseType = require('../models/Expense-Type');

/**
 * GET /get-expenses-type/page=:page&pageSize=:pageSize
 */
exports.getAllExpensesType = function(req, res) {
  var id = req.params.id;
  var params = {
    page: req.params.page,
    pageSize: req.params.pageSize
  };
  ExpenseType.getAllExpensesType(id, params)
  .then(function(expensesType) {
    res.send(JSON.stringify({ expensesType, pagination: expensesType.pagination }));
  }).catch(function(err) {
    console.error(err);
  });
};

/**
 * GET /get-active-expenses-type
 */
exports.getActiveExpensesType = function(req, res) {
  ExpenseType.getActiveExpensesType(req.user.id)
    .then(function(expensesType) {
      res.json(expensesType);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /expenses-type=:id
 */
exports.getExpenseTypeById = function(req, res) {
  ExpenseType.getById(req.user.id, req.params.id)
  .then(function(expenseType) {
    res.json(expenseType);
  }).catch(function(err) {
    console.error(err);
  });
};

/**
 * SAVE /expenses-type-new/:id
 * or
 * SAVE /expenses-type-id=:id
 */
exports.saveExpenseType = function(req, res) {
  var expenseType = null;
  var errors = null;
  var checkRecord = 0;
  var expenseTypeInsertedBy = req.params.expenseTypeInsertedBy;

  req.assert('expenseTypeDescription', 'Description cannot be blank').notEmpty();
  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }
  checkRecord = new ExpenseType({id: req.params.id});
  expenseType = new ExpenseType();

  if(!checkRecord.isNew()) {
    expenseType.save({
        id: req.params.id,
        expenseTypeInsertedBy: expenseTypeInsertedBy,
        expenseTypeDescription: req.body.expenseTypeDescription,
        expenseTypeIsActive: req.body.expenseTypeIsActive ? 1 : 0,
      }, { patch: true })
      .then(function(model) {
        res.send({ expenseType: model, msg: 'Expense type has been updated.' });
      })
      .catch(function(err) {
        res.send({ msg: err });
      });
    return;
  }
  expenseType.save({
      expenseTypeInsertedBy: expenseTypeInsertedBy,
      expenseTypeDescription: req.body.expenseTypeDescription,
      expenseTypeIsActive: req.body.expenseTypeIsActive ? 1 : 0,
    })
    .then(function(model) {
      res.send({ expenseType: model, msg: 'Expense type has been added.' });
    })
    .catch(function(err) {
      return res.status(400).send({ msg: err });
    });
};
