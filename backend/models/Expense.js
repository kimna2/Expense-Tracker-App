const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  icon: { type: String }, 
  category: { type: String, required: true }, // [IMPROVE] Add trim: true
  amount: { type: Number, required: true }, // [IMPROVE] Add min: 0.01
  date: { type: Date, default: Date.now },
}, { timestamps: true });

// [IMPROVE] Add index on { userId: 1, date: -1 } — every query filters by userId and sorts by date
module.exports = mongoose.model("Expense", ExpenseSchema);
