import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const TenantDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maintenanceForm, setMaintenanceForm] = useState({
    title: '',
    description: '',
    urgency: 'medium',
    category: 'general'
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);

  // Mock tenant data - replace with actual API calls
  const tenantData = {
    unitNumber: '304',
    propertyName: 'Sunset Apartments',
    address: '721 Meadowview Drive',
    rentAmount: 1200,
    nextPaymentDue: '2024-05-01',
    leaseEnd: '2024-08-31',
    paymentStatus: 'current'
  };

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: 'maintenance',
      title: 'Maintenance Update',
      message: 'Your plumbing request has been assigned to a technician',
      timestamp: '2024-04-15T10:30:00Z',
      isRead: false
    },
    {
      id: 2,
      type: 'payment',
      title: 'Rent Receipt',
      message: 'April rent payment confirmed. Thank you!',
      timestamp: '2024-04-05T09:15:00Z',
      isRead: true
    },
    {
      id: 3,
      type: 'general',
      title: 'Building Notice',
      message: 'Quarterly fire alarm testing scheduled for April 20th',
      timestamp: '2024-04-10T14:20:00Z',
      isRead: true
    }
  ];

  // Mock maintenance requests data
  const mockMaintenanceRequests = [
    {
      id: 'MEL-001',
      title: 'Kitchen Sink Leak',
      description: 'Water leaking from under the kitchen sink. Small puddle forming.',
      category: 'plumbing',
      urgency: 'high',
      status: 'in-progress',
      createdAt: '2024-04-12T10:30:00Z',
    },
    {
      id: 'MEL-002',
      title: 'Bedroom Outlet Not Working',
      description: 'The electrical outlet near the bedroom window stopped working suddenly.',
      category: 'electrical',
      urgency: 'medium',
      status: 'pending',
      createdAt: '2024-04-15T14:20:00Z',
    }
  ];

  // Status configurations
  const statusConfig = {
    'pending': { label: 'Pending Review', color: 'text-yellow-600 bg-yellow-50' },
    'in-progress': { label: 'In Progress', color: 'text-blue-600 bg-blue-50' },
    'completed': { label: 'Completed', color: 'text-green-600 bg-green-50' },
    'cancelled': { label: 'Cancelled', color: 'text-gray-600 bg-gray-50' }
  };

  // Urgency levels
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-50' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'high', label: 'High', color: 'text-orange-600 bg-orange-50' },
    { value: 'emergency', label: 'Emergency', color: 'text-red-600 bg-red-50' }
  ];

  // Fetch notifications and maintenance requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API calls
        setNotifications(mockNotifications);
        setMaintenanceRequests(mockMaintenanceRequests);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, [user?.id]);

  // Get pending requests for dashboard - MOVE THIS BEFORE THE RETURN STATEMENT
  const pendingRequests = maintenanceRequests.filter(
    request => request.status === 'pending' || request.status === 'in-progress'
  );

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!maintenanceForm.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!maintenanceForm.description.trim()) {
      errors.description = 'Description is required';
    } else if (maintenanceForm.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle maintenance form submission
  const handleMaintenanceSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Replace with actual API call
      const response = await fetch('/api/maintenance-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...maintenanceForm,
          tenantId: user.id,
          unitNumber: tenantData.unitNumber
        })
      });
      
      if (response.ok) {
        // Reset form
        setMaintenanceForm({
          title: '',
          description: '',
          urgency: 'medium',
          category: 'general'
        });
        setFormErrors({});
        
        // Show success message
        alert('Maintenance request submitted successfully!');
      } else {
        throw new Error('Failed to submit maintenance request');
      }
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      alert('Error submitting maintenance request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle rent payment
  const handleRentPayment = async () => {
    try {
      // Initiate payment via backend Daraja API integration
      const response = await fetch('/api/payments/initiate-rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: tenantData.rentAmount,
          tenantId: user.id,
          unitNumber: tenantData.unitNumber
        })
      });
      
      if (response.ok) {
        const paymentData = await response.json();
        
        // Redirect to payment gateway or show payment instructions
        if (paymentData.checkoutUrl) {
          window.location.href = paymentData.checkoutUrl;
        } else {
          // Show STK push instructions
          alert('Payment initiated. Check your phone for STK push prompt.');
        }
      } else {
        throw new Error('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Error initiating payment. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Stats data for overview - UPDATED to use pendingRequests
  const statsData = [
    { 
      title: "Rent Due", 
      value: `$${tenantData.rentAmount}`, 
      change: `Due ${formatDate(tenantData.nextPaymentDue)}`, 
      subtitle: `Unit ${tenantData.unitNumber}`,
      color: 'blue'
    },
    { 
      title: "Maintenance Requests", 
      value: pendingRequests.length.toString(), 
      change: `${pendingRequests.filter(r => r.status === 'in-progress').length} in progress`, 
      subtitle: "Last updated today",
      color: 'orange'
    },
    { 
      title: "Lease End", 
      value: formatDate(tenantData.leaseEnd).split(' ')[0], 
      change: "3 months left", 
      subtitle: "Renewal available soon",
      color: 'green'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {user?.name?.charAt(0) || 'T'}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name || 'Tenant'}!
                </h1>
                <p className="text-gray-600">
                  Unit {tenantData.unitNumber} • {tenantData.propertyName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
        <Link
        to="/tenant-dashboard/payments"
           className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
        >
  Pay Rent - ${tenantData.rentAmount}
</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'maintenance', 'documents', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statsData.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <span className={`text-${stat.color}-600 text-sm font-medium bg-${stat.color}-50 px-2 py-1 rounded-full`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{stat.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notifications Panel */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
                  <span className="text-sm text-gray-500">
                    {notifications.filter(n => !n.isRead).length} unread
                  </span>
                </div>
                
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.isRead 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          notification.type === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                          notification.type === 'payment' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {notification.type}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {notifications.length > 5 && (
                  <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium">
                    View All Notifications
                  </button>
                )}
              </div>

              {/* Maintenance Requests Section for Dashboard */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Maintenance Requests</h3>
                  <Link 
                    to="/tenant-dashboard/maintenance"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {pendingRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{request.title}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[request.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                            {statusConfig[request.status]?.label || request.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{request.description}</p>
                        <p className="text-xs text-gray-500">Submitted: {formatDate(request.createdAt)}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        urgencyLevels.find(u => u.value === request.urgency)?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {request.urgency}
                      </span>
                    </div>
                  ))}
                  
                  {pendingRequests.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No pending maintenance requests</p>
                      <Link 
                        to="/tenant-dashboard/maintenance"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Submit your first request
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('maintenance')}
                  className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 hover:bg-orange-100 transition-colors"
                >
                  <div className="text-lg font-semibold">Submit Maintenance</div>
                  <div className="text-sm opacity-75">Report an issue</div>
                </button>
                
                <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors">
                  <div className="text-lg font-semibold">View Documents</div>
                  <div className="text-sm opacity-75">Lease & receipts</div>
                </button>
                
                <button className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 hover:bg-green-100 transition-colors">
                  <div className="text-lg font-semibold">Payment History</div>
                  <div className="text-sm opacity-75">Past transactions</div>
                </button>
                
                <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors">
                  <div className="text-lg font-semibold">Contact Manager</div>
                  <div className="text-sm opacity-75">Get in touch</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Maintenance Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Submit Maintenance Request</h3>
              
              <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Title *
                  </label>
                  <input
                    type="text"
                    value={maintenanceForm.title}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, title: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Brief description of the issue"
                  />
                  {formErrors.title && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={maintenanceForm.category}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="hvac">HVAC</option>
                    <option value="appliance">Appliance</option>
                    <option value="structural">Structural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <select
                    value={maintenanceForm.urgency}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, urgency: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low - Routine maintenance</option>
                    <option value="medium">Medium - Needs attention soon</option>
                    <option value="high">High - Urgent repair needed</option>
                    <option value="emergency">Emergency - Immediate danger</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    value={maintenanceForm.description}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, description: e.target.value})}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Please provide detailed information about the issue..."
                  />
                  {formErrors.description && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Maintenance Request'}
                </button>
              </form>
            </div>

            {/* Maintenance History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Maintenance Requests</h3>
              
              <div className="space-y-4">
                {maintenanceRequests.map((request) => (
                  <div key={request.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{request.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[request.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {statusConfig[request.status]?.label || request.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Submitted: {formatDate(request.createdAt)}</span>
                      <span className="capitalize">{request.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs can be implemented similarly */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Documents & Files</h3>
            <p className="text-gray-600">Lease agreements, receipts, and important documents will appear here.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
            <p className="text-gray-600">Manage your profile and notification preferences.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;