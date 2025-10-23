<?php
// Intentionally included to match provided filename (misspelling).
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
$unit_id = $input['id'] ?? null;

if (!$unit_id) {
    http_response_code(400);
    echo json_encode(["message" => "Missing unit id"]);
    exit;
}

$query = "DELETE FROM units WHERE id = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $unit_id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Unit deleted"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to delete unit"]);
}
