<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
    exit;
}

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$input = json_decode(file_get_contents("php://input"), true);

$unit_number = $input['unit_number'] ?? null;
$property_id = $input['property_id'] ?? null;
$floor = $input['floor'] ?? null;
$rent = $input['rent'] ?? null;
$status = $input['status'] ?? 'available';

if (!$unit_number || !$property_id) {
    http_response_code(400);
    echo json_encode(["message" => "Missing required fields: unit_number or property_id"]);
    exit;
}

$query = "INSERT INTO units (unit_number, property_id, floor, rent, status, created_at) 
          VALUES (:unit_number, :property_id, :floor, :rent, :status, NOW())";
$stmt = $db->prepare($query);
$stmt->bindParam(':unit_number', $unit_number);
$stmt->bindParam(':property_id', $property_id);
$stmt->bindParam(':floor', $floor);
$stmt->bindParam(':rent', $rent);
$stmt->bindParam(':status', $status);

if ($stmt->execute()) {
    $id = $db->lastInsertId();
    http_response_code(201);
    echo json_encode(["message" => "Unit created", "id" => $id]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to create unit"]);
}
