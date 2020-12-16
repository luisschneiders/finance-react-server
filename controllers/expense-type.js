const ExpenseType = require('../models/Expense-Type');

/**
 * GET /get-expenses-type/page=:page&pageSize=:pageSize
 */
exports.getAllExpensesType = function(req, res) {
  let params = {
    page: req.params.page,
    pageSize: req.params.pageSize
  };
  ExpenseType.getAllExpensesType(req.user.id, params)
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
 * SAVE /expenses-type-new
 * or
 * SAVE /expenses-type-id=:id
 */
exports.saveExpenseType = function(req, res) {
  let expenseType = null;
  let errors = null;
  let checkRecord = 0;

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
        expenseTypeInsertedBy: req.user.id,
        expenseTypeDescription: req.body.expenseTypeDescription,
        expenseTypeIsActive: req.body.expenseTypeIsActive,
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
      expenseTypeInsertedBy: req.user.id,
      expenseTypeDescription: req.body.expenseTypeDescription,
      expenseTypeIsActive: req.body.expenseTypeIsActive,
    })
    .then(function(model) {
      res.send({ expenseType: model, msg: 'Expense type has been added.' });
    })
    .catch(function(err) {
      return res.status(400).send({ msg: err });
    });
};
