import { apiGet, apiPost } from './api';

export const tenantService = {
  // Domain-specific tenant endpoints
  async getTenantDashboard(tenantId) {
    const data = await apiGet(`/tenant/dashboard.php?id=${tenantId}`);
    if (data.status !== 'success') throw new Error(data.message || 'Failed to fetch tenant dashboard');
    return data;
  },

  async submitRentPayment(paymentData) {
    const data = await apiPost('/tenant/pay-rent.php', paymentData);
    if (data.status !== 'success') throw new Error(data.message || 'Failed to submit payment');
    return data;
  },

  async submitMaintenanceRequest(requestData) {
    const data = await apiPost('/tenant/maintenance-request.php', requestData);
    if (data.status !== 'success') throw new Error(data.message || 'Failed to submit maintenance request');
    return data;
  },

  // CRUD for tenants (api under properties folder or tenants folder depending on backend layout)
  async getAllTenants() {
    return await apiGet('/properties/get_tenants.php');
  },

  async getTenantById(id) {
    return await apiGet(`/properties/get_tenants.php?id=${id}`);
  },

  async createTenant(tenantData) {
    return await apiPost('/properties/create_tenant.php', tenantData);
  },

  async updateTenant(id, tenantData) {
    return await apiPost('/properties/update_tenant.php', { id, ...tenantData });
  },

  async deleteTenant(id) {
    return await apiPost('/properties/delete_tenant.php', { id });
  },

  // Convenience: unit-related helpers for tenant flows
  async getUnitsForProperty(propertyId) {
    return await apiGet(`/properties/get_units.php?property_id=${propertyId}`);
  },

  async getUnitById(id) {
    return await apiGet(`/properties/get_units.php?id=${id}`);
  },

  async createUnit(unitData) {
    return await apiPost('/properties/create_units.php', unitData);
  },

  async updateUnit(id, unitData) {
    return await apiPost('/properties/update_units.php', { id, ...unitData });
  },

  async deleteUnit(id) {
    return await apiPost('/properties/delete_unit.php', { id });
  },
};
