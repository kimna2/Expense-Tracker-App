const xlsx = require('xlsx');
const Expense = require("../models/Expense");

// [SIMPLIFY] This entire controller is ~95% identical to incomeController.js.
// Extract a shared CRUD factory to eliminate duplication.

// Add Expense
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    // [IMPROVE] Use a validation library instead of manual checks
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // [SIMPLIFY] Can use Expense.create({...}) instead of new + save
    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense); // [IMPROVE] Should be 201 for resource creation
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Expenses (For Logged-in User)
exports.getAllExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    // [IMPROVE] Add pagination (skip/limit) — returns ALL records
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    // [SECURITY] No userId check — any authenticated user can delete any expense by ID.
    // Fix: await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    await Expense.findByIdAndDelete(req.params.id);
    // [IMPROVE] Check if document existed before responding with success
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Expense Details in Excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));
    
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    // [BUG] Same race condition as incomeController — fixed filename, concurrent overwrites, no cleanup.
    // Fix: Stream buffer directly (see incomeController comments).
    xlsx.writeFile(wb, 'expense_details.xlsx');
    res.download('expense_details.xlsx');
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
