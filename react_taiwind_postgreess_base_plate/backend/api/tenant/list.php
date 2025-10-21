<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get all tenants with their unit and property information
    $query = "SELECT 
                u.user_ID,
                u.user_name,
                u.email,
                pu.unit_ID,
                pu.unit_name,
                pu.tenant_status,
                p.property_name,
                p.property_ID
              FROM users u
              JOIN properties_units pu ON pu.tenant_ID = u.user_ID
              JOIN properties p ON p.property_ID = pu.property_ID
              ORDER BY u.user_name ASC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $tenants = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "tenants" => $tenants
    ]);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}