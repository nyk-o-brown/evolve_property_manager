import { Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CostBreakdownChart from "../../components/layout/CostBreakdownChart";

// Data for the bar chart
const data = [
  { name: "Mon", value: 3000 },
  { name: "Tue", value: 3200 },
  { name: "Wed", value: 3100 },
  { name: "Thu", value: 4090 },
  { name: "Fri", value: 3200 },
  { name: "Sat", value: 3200 },
  { name: "Sun", value: 3200 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 text-sm">
        <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-100">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>${payload[0].value.toLocaleString()}</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{label}, 12 Jul</p>
      </div>
    );
  }
  return null;
};

export default function ReportsDashboard({ theme = "light" }) {
  const isDarkTheme = theme === "dark";
  const cardClasses = isDarkTheme
    ? "bg-gray-800 text-gray-200 shadow-lg"
    : "bg-white text-gray-800 shadow-md";

  const textColor = isDarkTheme ? "#9CA3AF" : "#6B7280";
  const barColor = isDarkTheme ? "#2c544e" : "#51857c";
  const activeBarColor = isDarkTheme ? "#487b72" : "#a1d9c7";

  return (
    <div className={`p-6 rounded-2xl ${cardClasses}`}>
      {/* Container for the charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart (Bar Chart) */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Report Sales</h2>
            <div className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-700">
              <Calendar size={18} />
              <span className="text-sm">Weekday</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barSize={30}
              >
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  stroke={textColor}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  stroke={textColor}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="value"
                  fill={barColor}
                  radius={[6, 6, 0, 0]}
                  activeBar={{ fill: activeBarColor }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Breakdown Chart (Pie Chart) */}
        <CostBreakdownChart theme={theme} />
      </div>
    </div>
  );
}
