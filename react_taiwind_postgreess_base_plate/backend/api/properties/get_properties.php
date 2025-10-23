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

    // Enhanced query: fetch properties with unit count, sample image, and description
    $sql = "
    SELECT p.property_ID,
           p.property_name,

           p.location,

           
           COALESCE(p.description, '') AS description,
           COALESCE(pi.image_URL, '') AS image_URL,
           COALESCE(u.unit_count, 0) AS units_count
    FROM properties p
    LEFT JOIN (
        SELECT property_ID, COUNT(*) AS unit_count
        FROM properties_units
        GROUP BY property_ID
    ) u ON u.property_ID = p.property_ID
    LEFT JOIN (
        SELECT property_ID, image_URL
        FROM (
          SELECT property_ID, image_URL, ROW_NUMBER() OVER (PARTITION BY property_ID ORDER BY unit_ID) rn
          FROM properties_units
          WHERE image_URL IS NOT NULL AND image_URL <> ''
        ) t WHERE rn = 1
    ) pi ON pi.property_ID = p.property_ID
    ORDER BY p.property_name;
    ";

    $stmt = $db->query($sql);
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'properties' => $properties]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
