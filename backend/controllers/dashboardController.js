const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// [CLEANUP] Comment says "Add Expense" but this is getDashboardData
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    // [SIMPLIFY] These 6 sequential DB queries can be reduced to 2 parallel calls using
    // Promise.all + MongoDB $facet aggregation. This cuts latency roughly in half.
    // Example:
    //   const [incomeResult, expenseResult] = await Promise.all([
    //     Income.aggregate([{ $match: { userId: userObjectId } }, { $facet: {
    //       total: [{ $group: { _id: null, total: { $sum: "$amount" } } }],
    //       last60Days: [{ $match: { date: { $gte: sixtyDaysAgo } } }, { $sort: { date: -1 } }],
    //       recent: [{ $sort: { date: -1 } }, { $limit: 5 }],
    //     }}]),
    //     Expense.aggregate([...same pattern...]),
    //   ]);

    // Fetch total income & expenses
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    console.log("totalIncome", {totalIncome, userId: isValidObjectId(userId)}); // [CLEANUP] Remove debug console.log
    

    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get income transactions in the last 60 days
    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }, // [READABILITY] Extract magic number: const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000
    }).sort({ date: -1 });

    // [SIMPLIFY] This .reduce() can be done in the DB aggregation instead of in JS
    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get expense transactions in the last 30 days
    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // [READABILITY] Same magic number issue
    }).sort({ date: -1 });

    // [SIMPLIFY] Same — compute total in DB, not JS
    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Fetch last 5 transactions (income + expenses)
    // [SIMPLIFY] These are 2 more sequential queries (total: 6). Use Promise.all at minimum.
    const lastTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "income",
        })
      ),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "expense",
        })
      ),
    ].sort((a, b) => b.date - a.date); // Sort latest first

    // Final Response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpense[0]?.total || 0,
      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    // [SECURITY] Sending raw `error` object to client can leak stack traces
    res.status(500).json({ message: "Server Error", error });
  }
};
