<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Only allow PUT or POST (if simulating PUT)
if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
    exit;
}

// Include DB config
require_once '../config/database.php'; // Adjust path as needed

$database = new Database();
$db = $database->getConnection();

// Get input data
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$property_id = $data['id'] ?? null;
$property_name = $data['property_name'] ?? null;
$location = $data['location'] ?? null;
$description = $data['description'] ?? null;

if (!$property_id || !$property_name || !$location) {
    http_response_code(400);
    echo json_encode(["message" => "Missing required fields"]);
    exit;
}

// Prepare update query
$query = "UPDATE properties 
          SET property_name = :property_name, 
              location = :location, 
              description = :description 
          WHERE id = :id";

$stmt = $db->prepare($query);

// Bind parameters
$stmt->bindParam(":property_name", $property_name);
$stmt->bindParam(":location", $location);
$stmt->bindParam(":description", $description);
$stmt->bindParam(":id", $property_id);

// Execute and respond
if ($stmt->execute()) {
    echo json_encode(["message" => "Property updated successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to update property"]);
}
?>
