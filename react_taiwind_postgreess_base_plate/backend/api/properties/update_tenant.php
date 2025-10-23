<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
    exit;
}

require_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

$input = json_decode(file_get_contents("php://input"), true);

$tenant_id = $input['id'] ?? null;
$name = $input['name'] ?? null;
$email = $input['email'] ?? null;
$phone = $input['phone'] ?? null;
$unit_id = $input['unit_id'] ?? null;

if (!$tenant_id) {
    http_response_code(400);
    echo json_encode(["message" => "Missing tenant id"]);
    exit;
}

// Build flexible update set
$fields = [];
$params = [':id' => $tenant_id];

if ($name !== null) { $fields[] = "name = :name"; $params[':name'] = $name; }
if ($email !== null) { $fields[] = "email = :email"; $params[':email'] = $email; }
if ($phone !== null) { $fields[] = "phone = :phone"; $params[':phone'] = $phone; }
if ($unit_id !== null) { $fields[] = "unit_id = :unit_id"; $params[':unit_id'] = $unit_id; }

if (count($fields) === 0) {
    http_response_code(400);
    echo json_encode(["message" => "No fields to update"]);
    exit;
}

$query = "UPDATE tenants SET " . implode(", ", $fields) . " WHERE id = :id";
$stmt = $db->prepare($query);

foreach ($params as $k => $v) {
    $stmt->bindValue($k, $v);
}

if ($stmt->execute()) {
    echo json_encode(["message" => "Tenant updated"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to update tenant"]);
}
