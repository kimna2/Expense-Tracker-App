import React, { useEffect, useState } from "react";
import CustomBarChart from "../charts/CustomBarChart";
import { prepareExpenseBarChartData } from "../../utils/helper";

const Last30DaysExpenses = ({ data }) => {
  // [SIMPLIFY] Derived data — use useMemo:
  //   const chartData = useMemo(() => prepareExpenseBarChartData(data), [data]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
   const result = prepareExpenseBarChartData(data);
   setChartData(result);

    return () => {}; // [CLEANUP] Empty cleanup — remove
  }, [data]);

  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
      </div>

      <CustomBarChart data={chartData} />
    </div>
  );
};

export default Last30DaysExpenses;
