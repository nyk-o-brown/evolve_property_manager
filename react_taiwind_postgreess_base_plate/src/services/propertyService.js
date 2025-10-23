import { apiGet, apiPost } from './api';

// Individual named exports for flexibility
export async function getAllProperties() {
  return await apiGet('/properties/get_properties.php');
}

export async function getPropertyById(id) {
  return await apiGet(`/properties/get_properties.php?id=${id}`);
}

export async function createProperty(propertyData) {
  return await apiPost('/properties/create_properties.php', propertyData);
}

export async function updateProperty(id, propertyData) {
  return await apiPost('/properties/update_properties.php', { id, ...propertyData });
}

export async function deleteProperty(id) {
  return await apiPost('/properties/delete_properties.php', { id });
}

// Units
export async function getAllUnits() {
  return await apiGet('/properties/get_units.php');
}

export async function getUnitsByProperty(propertyId) {
  return await apiGet(`/properties/get_units.php?property_id=${propertyId}`);
}

export async function createUnit(unitData) {
  return await apiPost('/properties/create_units.php', unitData);
}

export async function updateUnit(id, unitData) {
  return await apiPost('/properties/update_units.php', { id, ...unitData });
}

export async function deleteUnit(id) {
  return await apiPost('/properties/delete_unit.php', { id });
}

// Tenants
export async function getAllTenants() {
  return await apiGet('/properties/get_tenants.php');
}

export async function getTenantById(id) {
  return await apiGet(`/properties/get_tenants.php?id=${id}`);
}

export async function createTenant(tenantData) {
  return await apiPost('/properties/create_tenant.php', tenantData);
}

export async function updateTenant(id, tenantData) {
  return await apiPost('/properties/update_tenant.php', { id, ...tenantData });
}

export async function deleteTenant(id) {
  return await apiPost('/properties/delete_tenant.php', { id });
}
