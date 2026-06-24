import moment from "moment"; // [IMPROVE] moment.js is ~300KB. Replace with date-fns or native Intl.DateTimeFormat for the few format calls used.

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// [SIMPLIFY] This loop can be a one-liner:
//   name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

// [SIMPLIFY] This reimplements Number.toLocaleString(). Replace with:
//   num == null || isNaN(num) ? "" : Number(num).toLocaleString()
export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

// [SIMPLIFY] This function just picks 2 fields from each object — barely worth a function.
// If kept, simplify to: data.map(({ category, amount }) => ({ category, amount }))
export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map((item) => ({
    category: item?.category,
    amount: item?.amount,
  }));

  return chartData;
};

// [SIMPLIFY] prepareIncomeBarChartData and prepareExpenseLineChartData below are nearly identical.
// Consolidate into one generic function:
//   export const prepareChartData = (data, labelKey) =>
//     [...data].sort((a, b) => new Date(a.date) - new Date(b.date))
//       .map(item => ({ month: moment(item.date).format('Do MMM'), amount: item.amount, [labelKey]: item[labelKey] }));
export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format('Do MMM'),
    amount: item?.amount,
    source: item?.source,
  }));

  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format('Do MMM'),
    amount: item?.amount,
    category: item?.category,
  }));

  return chartData;
};
