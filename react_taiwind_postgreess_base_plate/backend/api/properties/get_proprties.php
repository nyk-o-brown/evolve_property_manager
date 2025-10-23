<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");




require_once '../../config/Database.php';

try {
    $db = (new Database())->getConnection();
    $stmt = $db->query("SELECT property_ID, property_name FROM properties");
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "properties" => $properties]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
