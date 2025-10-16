import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const TenantProfile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Mock tenant profile data - replace with actual API call
  const mockProfileData = {
    personalInfo: {
      firstName: 'John',
      lastName: 'Tenant',
      email: 'john.tenant@example.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-05-15',
      emergencyContact: {
        name: 'Sarah Wilson',
        relationship: 'Spouse',
        phone: '+1 (555) 987-6543',
        email: 'sarah.wilson@example.com'
      }
    },
    leaseInfo: {
      unitNumber: '304',
      buildingName: 'Sunset Apartments',
      address: '721 Meadowview Drive, Springfield, IL 62704',
      leaseStart: '2023-09-01',
      leaseEnd: '2024-08-31',
      rentAmount: 1200,
      securityDeposit: 1200,
      status: 'Active'
    },
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: false,
        maintenanceUpdates: true,
        paymentReminders: true,
        buildingAnnouncements: true
      },
      communication: {
        preferredContact: 'email',
        language: 'en',
        timezone: 'America/Chicago'
      }
    },
    documents: [
      { id: 1, name: 'Lease Agreement', type: 'lease', uploaded: '2023-08-15', status: 'verified' },
      { id: 2, name: 'ID Verification', type: 'id', uploaded: '2023-08-10', status: 'verified' },
      { id: 3, name: 'Proof of Income', type: 'income', uploaded: '2023-08-12', status: 'pending' }
    ],
    activity: [
      { id: 1, action: 'Profile Updated', date: '2024-04-15T14:30:00Z', details: 'Updated phone number' },
      { id: 2, action: 'Payment Made', date: '2024-04-01T09:15:00Z', details: 'Rent payment - $1,200' },
      { id: 3, action: 'Maintenance Request', date: '2024-03-28T16:45:00Z', details: 'Submitted plumbing issue' },
      { id: 4, action: 'Login', date: '2024-04-20T08:20:00Z', details: 'Logged in from Chrome' }
    ]
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Simulate API call
        // const response = await fetch(`/api/tenant/profile/${user.id}`);
        // const data = await response.json();
        
        setProfileData(mockProfileData);
        setFormData(mockProfileData.personalInfo);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!formData.emergencyContact?.name?.trim()) {
      errors['emergencyContact.name'] = 'Emergency contact name is required';
    }
    
    if (!formData.emergencyContact?.phone?.trim()) {
      errors['emergencyContact.phone'] = 'Emergency contact phone is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      // Replace with actual API call
      const response = await fetch('/api/tenant/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedProfile = await response.json();
        setProfileData(prev => ({ ...prev, personalInfo: updatedProfile }));
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle preference changes
  const handlePreferenceChange = async (category, key, value) => {
    try {
      const response = await fetch('/api/tenant/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ [category]: { [key]: value } })
      });
      
      if (response.ok) {
        setProfileData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            [category]: {
              ...prev.preferences[category],
              [key]: value
            }
          }
        }));
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format date time
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
            {profileData.personalInfo.firstName?.charAt(0)}{profileData.personalInfo.lastName?.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
            </h2>
            <p className="text-gray-600">{profileData.personalInfo.email}</p>
            <p className="text-sm text-gray-500">
              Unit {profileData.leaseInfo.unitNumber} • {profileData.leaseInfo.buildingName}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Member since</div>
            <div className="font-medium text-gray-900">{formatDate(profileData.leaseInfo.leaseStart)}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'personal', label: 'Personal Info' },
            { id: 'lease', label: 'Lease Details' },
            { id: 'preferences', label: 'Preferences' },
            { id: 'documents', label: 'Documents' },
            { id: 'activity', label: 'Activity' },
            { id: 'security', label: 'Security' }
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

      {/* Personal Information Tab */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.firstName ? 'border-red-300' : 'border-gray-300'
                    } ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {formErrors.firstName && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.lastName ? 'border-red-300' : 'border-gray-300'
                    } ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {formErrors.lastName && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  } ${!isEditing ? 'bg-gray-50' : ''}`}
                />
                {formErrors.email && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.phone ? 'border-red-300' : 'border-gray-300'
                  } ${!isEditing ? 'bg-gray-50' : ''}`}
                />
                {formErrors.phone && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
              </div>
            </form>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Emergency Contact</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formData.emergencyContact?.name || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors['emergencyContact.name'] ? 'border-red-300' : 'border-gray-300'
                  } ${!isEditing ? 'bg-gray-50' : ''}`}
                />
                {formErrors['emergencyContact.name'] && (
                  <p className="text-red-600 text-sm mt-1">{formErrors['emergencyContact.name']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship *
                </label>
                <input
                  type="text"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact?.relationship || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact?.phone || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors['emergencyContact.phone'] ? 'border-red-300' : 'border-gray-300'
                  } ${!isEditing ? 'bg-gray-50' : ''}`}
                />
                {formErrors['emergencyContact.phone'] && (
                  <p className="text-red-600 text-sm mt-1">{formErrors['emergencyContact.phone']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="emergencyContact.email"
                  value={formData.emergencyContact?.email || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lease Details Tab */}
      {activeTab === 'lease' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Lease Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Property Details</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>🏢 {profileData.leaseInfo.buildingName}</div>
                  <div>📍 {profileData.leaseInfo.address}</div>
                  <div>🚪 Unit {profileData.leaseInfo.unitNumber}</div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Lease Period</h3>
                <div className="text-sm text-green-800 space-y-1">
                  <div>📅 Start: {formatDate(profileData.leaseInfo.leaseStart)}</div>
                  <div>📅 End: {formatDate(profileData.leaseInfo.leaseEnd)}</div>
                  <div>⏰ Status: <span className="font-semibold">{profileData.leaseInfo.status}</span></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">Financial Information</h3>
                <div className="text-sm text-purple-800 space-y-1">
                  <div>💰 Monthly Rent: ${profileData.leaseInfo.rentAmount}</div>
                  <div>🏦 Security Deposit: ${profileData.leaseInfo.securityDeposit}</div>
                  <div>💳 Due Date: 1st of each month</div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-orange-800 hover:text-orange-900 p-2 rounded bg-orange-100 hover:bg-orange-200">
                    📄 View Full Lease Agreement
                  </button>
                  <button className="w-full text-left text-sm text-orange-800 hover:text-orange-900 p-2 rounded bg-orange-100 hover:bg-orange-200">
                    🔄 Request Lease Renewal
                  </button>
                  <button className="w-full text-left text-sm text-orange-800 hover:text-orange-900 p-2 rounded bg-orange-100 hover:bg-orange-200">
                    ❓ Contact Property Manager
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Notification Methods</h3>
              {Object.entries(profileData.preferences.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handlePreferenceChange('notifications', key, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Communication Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
                <select
                  value={profileData.preferences.communication.preferredContact}
                  onChange={(e) => handlePreferenceChange('communication', 'preferredContact', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="phone">Phone</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={profileData.preferences.communication.language}
                  onChange={(e) => handlePreferenceChange('communication', 'language', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={profileData.preferences.communication.timezone}
                  onChange={(e) => handlePreferenceChange('communication', 'timezone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Documents</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {profileData.documents.map((doc) => (
              <div key={doc.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      doc.status === 'verified' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <span className={`font-semibold ${
                        doc.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {doc.type.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{doc.name}</h3>
                      <p className="text-sm text-gray-500">
                        Uploaded {formatDate(doc.uploaded)} • 
                        <span className={`ml-2 ${
                          doc.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Download
                    </button>
                    {doc.status === 'pending' && (
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        Resubmit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {profileData.activity.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{activity.action}</h3>
                    <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                  </div>
                  <span className="text-sm text-gray-500">{formatDateTime(activity.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
          
          <div className="space-y-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Password</h3>
              <p className="text-sm text-gray-600 mb-3">Last changed 30 days ago</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Change Password
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Enable 2FA
              </button>
            </div>

            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-700 mb-3">Permanently delete your account and all data</p>
              <button 
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantProfile;