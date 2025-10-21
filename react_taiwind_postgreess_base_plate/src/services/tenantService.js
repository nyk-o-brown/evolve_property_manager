const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/tenant';

export const getTenantDashboard = async (tenantId) => {
  const response = await fetch(`${API_URL}/dashboard.php?id=${tenantId}`);
  const data = await response.json();
  if (data.status !== 'success') {
    throw new Error(data.message || 'Failed to fetch tenant dashboard');
  }
  return data;
};

export const submitRentPayment = async (paymentData) => {
  const response = await fetch(`${API_URL}/pay-rent.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });
  const data = await response.json();
  if (data.status !== 'success') {
    throw new Error(data.message || 'Failed to submit payment');
  }
  return data;
};

export const submitMaintenanceRequest = async (requestData) => {
  const response = await fetch(`${API_URL}/maintenance-request.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });
  const data = await response.json();
  if (data.status !== 'success') {
    throw new Error(data.message || 'Failed to submit maintenance request');
  }
  return data;
};