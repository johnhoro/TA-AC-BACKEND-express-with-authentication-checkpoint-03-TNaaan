let express = require("express");
let router = express.Router();
let Expense = require("../models/Expense");
let User = require("../models/User");
let moment = require("moment");

//render expense details page
router.get("/:id", (req, res, next) => {
  let id = req.params.id;
  Expense.findById(id, (err, expense) => {
    console.log(expense);
    // if (err) return next(err);
    // let date = moment(expense.date).format("DD/MM/YYYY");
    let now = new Date();
    var date = moment(now).format("YYYY-MM-DD");
    console.log(date); // Output: 2020-07-21.
    res.render("expenseDetails", { expense, date });
  });
});

//render expense edit page
router.get("/:id/edit", (req, res, next) => {
  let id = req.params.id;
  Expense.findById(id, (err, expense) => {
    if (err) return next(err);
    expense.category = expense.category.join(" ");
    res.render("expenseEditPage", { expense });
  });
});
//edit expense
router.post("/:id", (req, res, next) => {
  let id = req.params.id;
  req.body.category = req.body.category.trim().split(" ");
  Expense.findByIdAndUpdate(id, req.body, (err, expense) => {
    if (err) return next(err);
    res.redirect("/clients/statementList");
  });
});

//delete income
router.get("/:id/delete", (req, res, next) => {
  let id = req.params.id;
  Expense.findByIdAndDelete(id, (err, expense) => {
    if (err) return next(err);
    User.findByIdAndUpdate(
      expense.userId,
      { $pull: { expenses: id } },
      (err, user) => {
        if (err) return next(err);
        res.redirect("/clients/statementList");
      }
    );
  });
});
module.exports = router;
