import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PropertyProfitGraph({ propertyId }) {
  const [profitData, setProfitData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Monthly Profit',
          data: [2500, 3000, 2800, 3200, 3100, 3500],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'Monthly Expenses',
          data: [1500, 1800, 1600, 1700, 1900, 2000],
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        }
      ],
    };

    setProfitData(mockData);
  }, [propertyId]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Property Profit Analysis',
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Line options={options} data={profitData} />
    </div>
  );
}