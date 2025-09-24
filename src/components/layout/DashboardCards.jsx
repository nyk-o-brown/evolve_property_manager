/* eslint-disable no-unused-vars */
import {
  Building,
  BarChart3,
  DollarSign,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const cardData = [
  {
    icon: Building,
    iconColor: "text-green-500",
    bgColor: "bg-green-100",
    title: "Total Property",
    value: "1.500",
    change: "+20%",
    lastMonth: "1.050",
    changeColor: "text-green-500",
    arrow: ArrowUp,
  },
  {
    icon: BarChart3,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-100",
    title: "Number of Sales",
    value: "320",
    change: "-20%",
    lastMonth: "1.050",
    changeColor: "text-red-500",
    arrow: ArrowDown,
  },
  {
    icon: DollarSign,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-100",
    title: "Total Sales",
    value: "$150k",
    change: "+20%",
    lastMonth: "1.050",
    changeColor: "text-green-500",
    arrow: ArrowUp,
  },
];

const themes = {
  light: {
    card: "bg-white text-gray-800 shadow-md",
    value: "text-gray-900",
  },
  dark: {
    card: "bg-gray-800 text-gray-200 shadow-lg",
    value: "text-white",
  },
};

const StatCard = ({
  icon: Icon,
  iconColor,
  bgColor,
  title,
  value,
  change,
  lastMonth,
  changeColor,
  arrow: Arrow,
  theme,
}) => {
  const currentTheme = themes[theme] || themes.light;

  return (
    <div
      className={`p-6 rounded-2xl flex flex-col justify-between space-y-4 transition-colors duration-200 ${currentTheme.card}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${bgColor} ${iconColor}`}>
            <Icon size={20} />
          </div>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19.5" cy="12" r="1.5" />
            <circle cx="4.5" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      <div className={`text-4xl font-bold ${currentTheme.value}`}>{value}</div>

      <div className="flex items-center text-xs space-x-2">
        <span className={`flex items-center ${changeColor}`}>
          <Arrow size={12} />
          {change}
        </span>
        <span className="text-gray-500">Last month total {lastMonth}</span>
      </div>
    </div>
  );
};

export default function DashboardCards() {
  const theme = "dark"; // You'd get this from your theme state/context

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardData.map((card, index) => (
        <StatCard key={index} {...card} theme={theme} />
      ))}
    </div>
  );
}
