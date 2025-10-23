<?php
// Enable CORS and set response headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Only allow DELETE or POST (if simulating DELETE)
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
    exit;
}

// Connect to database
require_once '../config/database.php'; // Adjust path as needed

$database = new Database();
$db = $database->getConnection();

// Get raw input (for DELETE, use php://input)
$input = json_decode(file_get_contents("php://input"), true);
$property_id = $input['id'] ?? null;

if (!$property_id) {
    http_response_code(400);
    echo json_encode(["message" => "Missing property ID"]);
    exit;
}

// Prepare and execute delete query
$query = "DELETE FROM properties WHERE id = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(":id", $property_id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Property deleted successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to delete property"]);
}
?>
