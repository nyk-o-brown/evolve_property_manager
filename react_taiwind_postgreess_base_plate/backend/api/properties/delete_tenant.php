<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
    exit;
}

require_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

$input = json_decode(file_get_contents("php://input"), true);
$tenant_id = $input['id'] ?? null;

if (!$tenant_id) {
    http_response_code(400);
    echo json_encode(["message" => "Missing tenant id"]);
    exit;
}

// Hard delete
$query = "DELETE FROM tenants WHERE id = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $tenant_id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Tenant deleted"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to delete tenant"]);
}
