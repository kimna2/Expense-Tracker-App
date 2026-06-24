import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomBarChart = ({ data }) => {

  // [SIMPLIFY] One-liner: const getBarColor = (i) => i % 2 === 0 ? "#875cf5" : "#cfbefb";
  const getBarColor = (index) => {
    return index % 2 === 0 ? "#875cf5" : "#cfbefb"; 
  };

  // [SIMPLIFY] This tooltip is defined INSIDE the component — it gets recreated on every render.
  // Move it outside CustomBarChart as a standalone component.
  // [SIMPLIFY] Also, this tooltip is nearly identical to the one in CustomLineChart.
  // Extract a shared <ChartTooltip labelKey="category" /> component.
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-purple-800 mb-1">{payload[0].payload.category}</p>
          <p className="text-sm text-gray-600">
            Amount: <span className="text-sm font-medium text-gray-900">${payload[0].payload.amount}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />

          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />

          <Tooltip content={CustomTooltip} />

          <Bar
            dataKey="amount"
            fill="#FF8042"
            radius={[10, 10, 0, 0]}
            activeDot={{ r: 8, fill: "yellow" }}
            activeStyle={{ fill: "green" }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} /> // [IMPROVE] Use a stable key instead of index
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
