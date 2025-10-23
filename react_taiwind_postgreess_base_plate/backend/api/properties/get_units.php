<?php
// CORS and content headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Database connection
require_once '../../config/Database.php';

try {
    $db = (new Database())->getConnection();

    // Query: fetch units with property info, excluding unit_size
    $sql = "
    SELECT 
        u.unit_ID,
        u.unit_name,
        u.property_ID,
        u.rent,
        u.status,
        COALESCE(u.image_URL, '') AS image_URL,
        p.property_name
    FROM properties_units u
    INNER JOIN properties p ON u.property_ID = p.property_ID
    ORDER BY p.property_name, u.unit_name;
    ";

    $stmt = $db->query($sql);
    $units = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'units' => $units]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
