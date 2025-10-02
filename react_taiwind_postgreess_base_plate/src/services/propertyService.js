// Temporary mock data service - replace with actual API calls later
const mockProperties = [
  {
    id: 1,
    name: "Sunset Apartments",
    address: "123 Main St",
    units: 10,
    description: "Modern apartment complex with great amenities"
  }
];

export const getProperties = async () => {
  return mockProperties;
};

export const getProperty = async (id) => {
  return mockProperties.find(p => p.id === parseInt(id));
};

export const createProperty = async (propertyData) => {
  const newProperty = {
    id: mockProperties.length + 1,
    ...propertyData
  };
  mockProperties.push(newProperty);
  return newProperty;
};

export const updateProperty = async (id, propertyData) => {
  const index = mockProperties.findIndex(p => p.id === parseInt(id));
  if (index === -1) return null;
  
  mockProperties[index] = {
    ...mockProperties[index],
    ...propertyData
  };
  return mockProperties[index];
};

export const deleteProperty = async (id) => {
  const index = mockProperties.findIndex(p => p.id === parseInt(id));
  if (index === -1) return false;
  
  mockProperties.splice(index, 1);
  return true;
};





// src/services/propertyService.js
const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api';

export const propertyService = {
    async getAllProperties() {
        try {
            console.log('Fetching from:', `${API_URL}/properties/read.php`);
            const response = await fetch(`${API_URL}/properties/read.php`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },

    async createProperty(propertyData) {
        const response = await fetch(`${API_URL}/properties/create.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(propertyData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },

    async updateProperty(id, propertyData) {
        const response = await fetch(`${API_URL}/properties/update.php`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, ...propertyData }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },

    async deleteProperty(id) {
        const response = await fetch(`${API_URL}/properties/delete.php`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },
};