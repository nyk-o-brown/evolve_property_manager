<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Only allow PUT or POST
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
    exit;
}

// Include DB config
require_once '../config/database.php'; // Adjust path as needed

$database = new Database();
$db = $database->getConnection();

// Get input data
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$unit_ID = $data['unit_ID'] ?? null;
$unit_name = $data['unit_name'] ?? null;
$rent_price = $data['rent_price'] ?? null;
$tenant_status = $data['tenant_status'] ?? null;
$lease_start_date = $data['lease_start_date'] ?? null;
$lease_end_date = $data['lease_end_date'] ?? null;
$security_deposit = $data['security_deposit'] ?? null;

if (!$unit_ID || !$unit_name || !$rent_price || !$tenant_status) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

// Prepare update query
$query = "UPDATE properties_units 
          SET unit_name = :unit_name,
              rent_price = :rent_price,
              tenant_status = :tenant_status,
              lease_start_date = :lease_start_date,
              lease_end_date = :lease_end_date,
              security_deposit = :security_deposit
          WHERE unit_ID = :unit_ID";

$stmt = $db->prepare($query);

// Bind parameters
$stmt->bindParam(":unit_name", $unit_name);
$stmt->bindParam(":rent_price", $rent_price);
$stmt->bindParam(":tenant_status", $tenant_status);
$stmt->bindParam(":lease_start_date", $lease_start_date);
$stmt->bindParam(":lease_end_date", $lease_end_date);
$stmt->bindParam(":security_deposit", $security_deposit);
$stmt->bindParam(":unit_ID", $unit_ID);

// Execute and respond
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Unit updated successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to update unit"]);
}
?>
