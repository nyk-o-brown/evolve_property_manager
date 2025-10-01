import { useState, useEffect } from 'react';
import { BellIcon, WrenchIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockNotifications = [
      {
        id: 1,
        type: 'payment',
        title: 'Late Payment',
        message: 'John Doe - Apt 201 is 5 days overdue',
        date: '2025-09-25',
      },
      {
        id: 2,
        type: 'maintenance',
        title: 'Urgent Repair',
        message: 'Water leak reported in Apt 304',
        date: '2025-09-24',
      },
      {
        id: 3,
        type: 'payment',
        title: 'Late Payment',
        message: 'Sarah Smith - Apt 105 is 3 days overdue',
        date: '2025-09-23',
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'payment':
        return <CurrencyDollarIcon className="h-6 w-6 text-red-500" />;
      case 'maintenance':
        return <WrenchIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <BellIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-md transition-colors duration-150"
          >
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}