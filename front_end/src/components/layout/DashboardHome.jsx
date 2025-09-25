// src/components/DashboardHome.jsx
import CostBreakdownChart from "./CostBreakdownChart";
import DashboardCards from "./DashboardCards"; // Assuming you saved the above code here

// Sample data for transactions
const transactions = [
  {
    image: "/images/123-maple.jpg", // Replace with actual image paths or URLs
    title: "123 Maple Avenue Springfield",
    date: "12 Sep 2024, 9:29",
    amount: "$30k",
  },
  {
    image: "/images/987-villa.jpg",
    title: "Booking 987 Villa Street",
    date: "10 Sep 2024, 9:29",
    amount: "$10k",
  },
  {
    image: "/images/garden-street.jpg",
    title: "Apartment Booking On Garden Street",
    date: "08 Sep 2024, 9:29",
    amount: "$20k",
  },
];

// Reusable component for a single transaction item
const TransactionItem = ({ image, title, date, amount, isDarkTheme }) => {
  const textColor = isDarkTheme ? "text-gray-200" : "text-gray-800";
  const dateColor = isDarkTheme ? "text-gray-400" : "text-gray-500";
  const amountColor = isDarkTheme ? "text-green-400" : "text-green-600";

  return (
    <li className="flex justify-between items-center py-4 border-b last:border-b-0 border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <img
          src={image}
          alt={title}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div>
          <h4 className={`text-base font-medium ${textColor}`}>{title}</h4>
          <span className={`text-sm ${dateColor}`}>{date}</span>
        </div>
      </div>
      <span className={`font-semibold ${amountColor}`}>{amount}</span>
    </li>
  );
};

// The main LastTransactions component
const LastTransactions = ({ theme = "light" }) => {
  const isDarkTheme = theme === "dark";
  const cardClasses = isDarkTheme
    ? "bg-gray-800 text-gray-200 shadow-lg"
    : "bg-white text-gray-800 shadow-md";

  return (
    <div className={`p-6 rounded-2xl ${cardClasses}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Last Transactions</h3>
        <a
          href="/dashboard/transactions"
          className="text-sm font-medium text-blue-500 hover:underline flex items-center"
        >
          See All
        </a>
      </div>
      <ul>
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={index}
            {...transaction}
            isDarkTheme={isDarkTheme}
          />
        ))}
      </ul>
    </div>
  );
};

export default function DashboardHome({ theme = "light" }) {
  return (
    <div className="p-6 space-y-8">
      <DashboardCards theme={theme} />
      <LastTransactions theme={theme} />
      <CostBreakdownChart />
    </div>
  );
}
