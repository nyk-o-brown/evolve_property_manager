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