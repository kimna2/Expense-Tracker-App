const xlsx = require('xlsx');
const Income = require("../models/Income");

// [SIMPLIFY] This entire controller is ~95% identical to expenseController.js.
// Extract a shared CRUD factory: createCrudController(Model, { labelField, sheetName })
// to eliminate ~80 lines of duplication.

// Add Income
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    // Validation: Check for missing fields
    // [IMPROVE] Use a validation library instead of manual checks — duplicated in expenseController too
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // [SIMPLIFY] Can use Income.create({...}) instead of new Income() + .save() — one line instead of two
    const newIncome = new Income({ 
      userId, 
      icon, 
      source, 
      amount, 
      date: new Date(date)
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Income (For Logged-in User)
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    // [IMPROVE] Add pagination (skip/limit) — this returns ALL records which won't scale
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Income
exports.deleteIncome = async (req, res) => {
  const userId = req.user.id; // [BUG] userId is extracted but never used in the query below

  try {
    // [SECURITY] Any authenticated user can delete ANY user's income by guessing the ID.
    // Fix: await Income.findOneAndDelete({ _id: req.params.id, userId });
    await Income.findByIdAndDelete(req.params.id);
    // [IMPROVE] Check if the document existed before responding with success
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Income Details in Excel
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));
    
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    // [BUG] Writes to a fixed filename on disk — concurrent requests overwrite each other (race condition).
    // [BUG] File is never cleaned up, accumulates on server disk.
    // Fix: Stream a buffer directly instead of writing to disk:
    //   const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    //   res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //   res.set('Content-Disposition', 'attachment; filename=income_details.xlsx');
    //   res.send(buf);
    xlsx.writeFile(wb, 'income_details.xlsx');
    res.download('income_details.xlsx');
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
