import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const TenantProperties = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState(null);

  // Mock property data - replace with actual API call
  const mockPropertyData = {
    id: 'PROP-001',
    unitNumber: '304',
    buildingName: 'Sunset Apartments',
    address: '721 Meadowview Drive',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 850,
    rentAmount: 1200,
    securityDeposit: 1200,
    leaseStart: '2023-09-01',
    leaseEnd: '2024-08-31',
    parkingSpots: 1,
    petsAllowed: true,
    petDeposit: 300,
    amenities: [
      'Swimming Pool',
      'Fitness Center',
      'Laundry Facility',
      'Parking Garage',
      '24/7 Security',
      'Elevator',
      'Central AC'
    ],
    landlord: {
      name: 'Premium Properties Management',
      phone: '(555) 123-4567',
      email: 'management@premiumprops.com',
      emergencyPhone: '(555) 123-EMER'
    },
    maintenanceContacts: [
      {
        type: 'Emergency',
        name: '24/7 Emergency Line',
        phone: '(555) 123-EMER',
        hours: '24/7'
      },
      {
        type: 'Maintenance',
        name: 'Maintenance Office',
        phone: '(555) 123-MAINT',
        hours: 'Mon-Fri 8AM-5PM'
      },
      {
        type: 'Plumbing',
        name: 'QuickFlow Plumbing',
        phone: '(555) 123-PLUMB',
        hours: '24/7 Emergency'
      }
    ],
    documents: [
      { name: 'Lease Agreement', type: 'pdf', date: '2023-08-15', size: '2.4 MB' },
      { name: 'House Rules', type: 'pdf', date: '2023-08-15', size: '1.1 MB' },
      { name: 'Emergency Procedures', type: 'pdf', date: '2023-08-15', size: '0.8 MB' },
      { name: 'Maintenance Request Form', type: 'doc', date: '2023-08-15', size: '0.5 MB' }
    ],
    neighbors: [
      { unit: '303', name: 'Sarah Johnson', phone: '(555) 234-5678' },
      { unit: '305', name: 'Mike Chen', phone: '(555) 345-6789' }
    ]
  };

  // Fetch property data
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        // Simulate API call
        // const response = await fetch(`/api/properties/tenant/${user.id}`);
        // const data = await response.json();
        
        setProperty(mockPropertyData);
      } catch (error) {
        console.error('Error fetching property data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, [user?.id]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days until lease end
  const getDaysUntilLeaseEnd = () => {
    const today = new Date();
    const leaseEnd = new Date(property.leaseEnd);
    const diffTime = leaseEnd - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Property Assigned</h2>
          <p className="text-gray-600">You don't have any active property assignments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Property</h1>
        <p className="text-gray-600">
          {property.buildingName} • Unit {property.unitNumber}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Monthly Rent</p>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(property.rentAmount)}</h3>
          <p className="text-xs text-gray-500 mt-2">Due on 1st of each month</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Lease Ends</p>
          <h3 className="text-2xl font-bold text-gray-900">{formatDate(property.leaseEnd)}</h3>
          <p className="text-xs text-gray-500 mt-2">{getDaysUntilLeaseEnd()} days remaining</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Property Type</p>
          <h3 className="text-2xl font-bold text-gray-900">{property.type}</h3>
          <p className="text-xs text-gray-500 mt-2">{property.bedrooms} bed, {property.bathrooms} bath</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Square Feet</p>
          <h3 className="text-2xl font-bold text-gray-900">{property.squareFeet} sq ft</h3>
          <p className="text-xs text-gray-500 mt-2">Spacious living area</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'details', label: 'Property Details' },
            { id: 'contacts', label: 'Contacts' },
            { id: 'documents', label: 'Documents' },
            { id: 'neighbors', label: 'Neighbors' }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Overview</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Address</p>
                  <p className="text-blue-700">{property.address}</p>
                  <p className="text-blue-600 text-sm">{property.city}, {property.state} {property.zipCode}</p>
                </div>
                <span className="text-2xl">📍</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Lease Period</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(property.leaseStart)} - {formatDate(property.leaseEnd)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Security Deposit</p>
                  <p className="font-medium text-gray-900">{formatCurrency(property.securityDeposit)}</p>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="font-medium text-green-900 mb-2">Rent Payment Information</p>
                <p className="text-green-700 text-sm">
                  Rent of {formatCurrency(property.rentAmount)} is due on the 1st of each month. 
                  A 5-day grace period applies. Late fees are $50 after the grace period.
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Building Amenities</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-lg mr-3">✅</span>
                  <span className="text-sm font-medium text-gray-900">{amenity}</span>
                </div>
              ))}
            </div>

            {/* Additional Features */}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-medium text-orange-900 mb-2">Unit Features</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-orange-800">
                <div>• {property.bedrooms} Bedrooms</div>
                <div>• {property.bathrooms} Bathrooms</div>
                <div>• {property.squareFeet} Sq Ft</div>
                <div>• {property.parkingSpots} Parking Spot(s)</div>
                <div>• {property.petsAllowed ? 'Pets Allowed' : 'No Pets'}</div>
                {property.petsAllowed && <div>• Pet Deposit: {formatCurrency(property.petDeposit)}</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Details Tab */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lease Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Lease Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <span className="text-gray-600">Lease Start</span>
                <span className="font-medium">{formatDate(property.leaseStart)}</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <span className="text-gray-600">Lease End</span>
                <span className="font-medium">{formatDate(property.leaseEnd)}</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <span className="text-gray-600">Monthly Rent</span>
                <span className="font-medium">{formatCurrency(property.rentAmount)}</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <span className="text-gray-600">Security Deposit</span>
                <span className="font-medium">{formatCurrency(property.securityDeposit)}</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <span className="text-gray-600">Pet Deposit</span>
                <span className="font-medium">
                  {property.petsAllowed ? formatCurrency(property.petDeposit) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-gray-600">Parking Spots</span>
                <span className="font-medium">{property.parkingSpots}</span>
              </div>
            </div>
          </div>

          {/* Property Specifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Specifications</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{property.bedrooms}</div>
                  <div className="text-sm text-blue-800">Bedrooms</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{property.bathrooms}</div>
                  <div className="text-sm text-green-800">Bathrooms</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{property.squareFeet}</div>
                  <div className="text-sm text-purple-800">Square Feet</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{property.parkingSpots}</div>
                  <div className="text-sm text-orange-800">Parking Spots</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Additional Information</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>• Property Type: {property.type}</div>
                  <div>• Building: {property.buildingName}</div>
                  <div>• Unit: {property.unitNumber}</div>
                  <div>• Pets: {property.petsAllowed ? 'Allowed' : 'Not Allowed'}</div>
                  {property.petsAllowed && <div>• Pet Deposit: {formatCurrency(property.petDeposit)}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Management */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Management</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">{property.landlord.name}</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>📞 {property.landlord.phone}</div>
                  <div>📧 {property.landlord.email}</div>
                  <div>🚨 Emergency: {property.landlord.emergencyPhone}</div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Office Hours</h3>
                <div className="text-sm text-green-800 space-y-1">
                  <div>Monday - Friday: 9:00 AM - 5:00 PM</div>
                  <div>Saturday: 10:00 AM - 2:00 PM</div>
                  <div>Sunday: Closed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Contacts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Maintenance Contacts</h2>
            
            <div className="space-y-4">
              {property.maintenanceContacts.map((contact, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{contact.type}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {contact.hours}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{contact.name}</p>
                  <p className="text-lg font-semibold text-gray-900">{contact.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Property Documents</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {property.documents.map((doc, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{doc.type.toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{doc.name}</h3>
                      <p className="text-sm text-gray-500">
                        Uploaded {formatDate(doc.date)} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Neighbors Tab */}
      {activeTab === 'neighbors' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Building Neighbors</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {property.neighbors.map((neighbor, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{neighbor.name}</h3>
                    <p className="text-sm text-gray-500">Unit {neighbor.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">{neighbor.phone}</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantProperties;