const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  icon: { type: String }, 
  source: { type: String, required: true }, // [IMPROVE] Add trim: true to prevent whitespace-only values
  amount: { type: Number, required: true }, // [IMPROVE] Add min: 0.01 to enforce positive amounts at schema level
  date: { type: Date, default: Date.now },
}, { timestamps: true });

// [IMPROVE] Add index on { userId: 1, date: -1 } — every query filters by userId and sorts by date
module.exports = mongoose.model("Income", IncomeSchema);
