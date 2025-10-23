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

$unit_id = $input['id'] ?? null;
$unit_number = $input['unit_number'] ?? null;
$floor = $input['floor'] ?? null;
$rent = $input['rent'] ?? null;
$status = $input['status'] ?? null;
$property_id = $input['property_id'] ?? null;

if (!$unit_id) {
    http_response_code(400);
    echo json_encode(["message" => "Missing unit id"]);
    exit;
}

$fields = [];
$params = [':id' => $unit_id];

if ($unit_number !== null) { $fields[] = "unit_number = :unit_number"; $params[':unit_number'] = $unit_number; }
if ($floor !== null) { $fields[] = "floor = :floor"; $params[':floor'] = $floor; }
if ($rent !== null) { $fields[] = "rent = :rent"; $params[':rent'] = $rent; }
if ($status !== null) { $fields[] = "status = :status"; $params[':status'] = $status; }
if ($property_id !== null) { $fields[] = "property_id = :property_id"; $params[':property_id'] = $property_id; }

if (count($fields) === 0) {
    http_response_code(400);
    echo json_encode(["message" => "No fields to update"]);
    exit;
}

$query = "UPDATE units SET " . implode(", ", $fields) . " WHERE id = :id";
$stmt = $db->prepare($query);

foreach ($params as $k => $v) {
    $stmt->bindValue($k, $v);
}

if ($stmt->execute()) {
    echo json_encode(["message" => "Unit updated"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to update unit"]);
}
