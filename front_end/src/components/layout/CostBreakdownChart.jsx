// src/components/CostBreakdownChart.jsx
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "Maintenance", value: 4750, color: "#9DC28F" },
  { name: "Repair", value: 1050, color: "#F3C48C" },
  { name: "Taxes", value: 1600, color: "#A8DADC" },
  { name: "Saving", value: 2500, color: "#B8B2D5" },
];

const COLORS = data.map((item) => item.color);

export default function CostBreakdownChart({ theme = "light" }) {
  const isDarkTheme = theme === "dark";
  const cardClasses = isDarkTheme
    ? "bg-gray-800 text-gray-200 shadow-lg"
    : "bg-white text-gray-800 shadow-md";

  return (
    <div className={`p-6 rounded-2xl ${cardClasses}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Cost Breakdown</h2>
        <a
          href="/dashboard/reports"
          className="text-sm font-medium text-blue-500 hover:underline"
        >
          See Details
        </a>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                startAngle={90}
                endAngle={450}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-xl font-bold">{`$${data
              .reduce((sum, item) => sum + item.value, 0)
              .toLocaleString()}`}</div>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0 md:ml-6">
          <ul className="space-y-3">
            {data.map((entry, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm">{entry.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
