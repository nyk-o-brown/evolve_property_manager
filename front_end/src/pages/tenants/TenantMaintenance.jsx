import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const TenantMaintenance = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('new');
  const [maintenanceForm, setMaintenanceForm] = useState({
    title: '',
    description: '',
    category: 'general',
    urgency: 'medium',
    permissionToEnter: true,
    images: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      updatedAt: '2024-04-14T15:20:00Z',
      assignedTo: 'Mike Plumber',
      estimatedCompletion: '2024-04-16',
      permissionToEnter: true,
      images: []
    },
    {
      id: 'MEL-002',
      title: 'Bedroom Outlet Not Working',
      description: 'The electrical outlet near the bedroom window stopped working suddenly.',
      category: 'electrical',
      urgency: 'medium',
      status: 'pending',
      createdAt: '2024-04-15T14:20:00Z',
      updatedAt: '2024-04-15T14:20:00Z',
      assignedTo: null,
      estimatedCompletion: null,
      permissionToEnter: true,
      images: []
    },
    {
      id: 'MEL-003',
      title: 'AC Not Cooling Properly',
      description: 'Air conditioner blowing warm air even when set to cool mode.',
      category: 'hvac',
      urgency: 'medium',
      status: 'completed',
      createdAt: '2024-04-05T09:15:00Z',
      updatedAt: '2024-04-08T11:45:00Z',
      assignedTo: 'HVAC Solutions',
      estimatedCompletion: '2024-04-08',
      permissionToEnter: true,
      images: []
    },
    {
      id: 'MEL-004',
      title: 'Broken Window Blinds',
      description: 'Blinds in living room are stuck and cannot be adjusted.',
      category: 'general',
      urgency: 'low',
      status: 'completed',
      createdAt: '2024-03-28T16:40:00Z',
      updatedAt: '2024-03-30T10:15:00Z',
      assignedTo: 'Maintenance Team',
      estimatedCompletion: '2024-03-30',
      permissionToEnter: true,
      images: []
    }
  ];

  // Categories for maintenance requests
  const categories = [
    { value: 'plumbing', label: 'Plumbing', icon: '🚰' },
    { value: 'electrical', label: 'Electrical', icon: '⚡' },
    { value: 'hvac', label: 'HVAC', icon: '❄️' },
    { value: 'appliance', label: 'Appliance', icon: '🏠' },
    { value: 'structural', label: 'Structural', icon: '🏗️' },
    { value: 'pest', label: 'Pest Control', icon: '🐜' },
    { value: 'general', label: 'General', icon: '🔧' }
  ];

  // Urgency levels
  const urgencyLevels = [
    { value: 'low', label: 'Low - Routine maintenance', color: 'text-green-600 bg-green-50' },
    { value: 'medium', label: 'Medium - Needs attention soon', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'high', label: 'High - Urgent repair needed', color: 'text-orange-600 bg-orange-50' },
    { value: 'emergency', label: 'Emergency - Immediate danger', color: 'text-red-600 bg-red-50' }
  ];

  // Status configurations
  const statusConfig = {
    'pending': { label: 'Pending Review', color: 'text-yellow-600 bg-yellow-50' },
    'in-progress': { label: 'In Progress', color: 'text-blue-600 bg-blue-50' },
    'completed': { label: 'Completed', color: 'text-green-600 bg-green-50' },
    'cancelled': { label: 'Cancelled', color: 'text-gray-600 bg-gray-50' }
  };

  // Fetch maintenance requests
  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        // Simulate API call
        // const response = await fetch(`/api/maintenance-requests/${user.id}`);
        // const data = await response.json();
        
        // Using mock data for now
        setMaintenanceRequests(mockMaintenanceRequests);
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, [user?.id]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!maintenanceForm.title.trim()) {
      errors.title = 'Title is required';
    } else if (maintenanceForm.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }
    
    if (!maintenanceForm.description.trim()) {
      errors.description = 'Description is required';
    } else if (maintenanceForm.description.length < 10) {
      errors.description = 'Please provide more details (at least 10 characters)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmitMaintenanceRequest = async (e) => {
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
          unitNumber: user.unitNumber || '304'
        })
      });
      
      if (response.ok) {
        const newRequest = await response.json();
        
        // Add to local state
        setMaintenanceRequests(prev => [newRequest, ...prev]);
        
        // Reset form
        setMaintenanceForm({
          title: '',
          description: '',
          category: 'general',
          urgency: 'medium',
          permissionToEnter: true,
          images: []
        });
        setFormErrors({});
        
        // Switch to history tab
        setActiveTab('history');
        
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMaintenanceForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Filter requests based on active tab
  const filteredRequests = maintenanceRequests.filter(request => {
    if (activeTab === 'pending') {
      return request.status === 'pending' || request.status === 'in-progress';
    } else if (activeTab === 'history') {
      return request.status === 'completed' || request.status === 'cancelled';
    }
    return true;
  });

  // Get pending requests for dashboard
  const pendingRequests = maintenanceRequests.filter(
    request => request.status === 'pending' || request.status === 'in-progress'
  );

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading maintenance requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Requests</h1>
        <p className="text-gray-600">Submit new requests and track existing maintenance issues</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'new', label: 'New Request' },
            { id: 'pending', label: `Pending (${pendingRequests.length})` },
            { id: 'history', label: 'History' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* New Request Form */}
      {activeTab === 'new' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit Maintenance Request</h2>
              
              <form onSubmit={handleSubmitMaintenanceRequest} className="space-y-6">
                {/* Issue Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={maintenanceForm.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Brief description of the issue"
                  />
                  {formErrors.title && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.title}</p>
                  )}
                </div>

                {/* Category and Urgency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={maintenanceForm.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level
                    </label>
                    <select
                      name="urgency"
                      value={maintenanceForm.urgency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {urgencyLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    name="description"
                    value={maintenanceForm.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Please provide detailed information about the issue, including location, when it started, and any other relevant details..."
                  />
                  {formErrors.description && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>

                {/* Permission to Enter */}
                <div className="flex items-center">
                  <input
                    id="permissionToEnter"
                    name="permissionToEnter"
                    type="checkbox"
                    checked={maintenanceForm.permissionToEnter}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="permissionToEnter" className="ml-2 block text-sm text-gray-700">
                    I grant permission for maintenance staff to enter my unit to perform repairs when I'm not home
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                      Submitting Request...
                    </div>
                  ) : (
                    'Submit Maintenance Request'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Guidelines */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-3">📋 Request Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Provide clear, detailed descriptions</li>
                <li>• Include specific locations</li>
                <li>• Mention when the issue started</li>
                <li>• Select appropriate urgency level</li>
                <li>• Emergency: Fire, flood, no heat in winter</li>
              </ul>
            </div>

            <div className="bg-orange-50 rounded-2xl border border-orange-200 p-6">
              <h3 className="font-semibold text-orange-900 mb-3">⏰ Response Times</h3>
              <ul className="text-sm text-orange-800 space-y-2">
                <li>• <strong>Emergency:</strong> 2-4 hours</li>
                <li>• <strong>High Urgency:</strong> 24 hours</li>
                <li>• <strong>Medium Urgency:</strong> 2-3 days</li>
                <li>• <strong>Low Urgency:</strong> 5-7 days</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
              <h3 className="font-semibold text-green-900 mb-3">📞 Emergency Contact</h3>
              <p className="text-sm text-green-800">
                For after-hours emergencies (fire, flood, security issues):
              </p>
              <p className="text-lg font-bold text-green-900 mt-2">(555) 123-EMER</p>
            </div>
          </div>
        </div>
      )}

      {/* Pending and History Tabs */}
      {(activeTab === 'pending' || activeTab === 'history') && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeTab === 'pending' ? 'Pending Requests' : 'Request History'}
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredRequests.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">🔧</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600">
                  {activeTab === 'pending' 
                    ? 'You have no pending maintenance requests.' 
                    : 'Your completed maintenance requests will appear here.'
                  }
                </p>
                {activeTab === 'pending' && (
                  <button
                    onClick={() => setActiveTab('new')}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit New Request
                  </button>
                )}
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[request.status].color}`}>
                          {statusConfig[request.status].label}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          urgencyLevels.find(u => u.value === request.urgency)?.color
                        }`}>
                          {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{request.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>ID: {request.id}</span>
                        <span>Category: {
                          categories.find(c => c.value === request.category)?.label
                        }</span>
                        <span>Submitted: {formatDate(request.createdAt)}</span>
                        {request.assignedTo && (
                          <span>Assigned to: {request.assignedTo}</span>
                        )}
                        {request.estimatedCompletion && (
                          <span>Estimated: {formatDate(request.estimatedCompletion)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm text-gray-500">
                        {request.status === 'completed' ? 'Completed' : 'Last updated'}: {formatDate(request.updatedAt)}
                      </span>
                      {request.status === 'pending' && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Update Request
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {request.status === 'in-progress' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-blue-800">
                        <strong>Update:</strong> Your request is being worked on. {request.assignedTo} is scheduled to complete this by {formatDate(request.estimatedCompletion)}.
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantMaintenance;