<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Only POST for creation
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Allow only POST for create
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
    exit;
}

// Include DB config (adjust path if needed)
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get input data
$data = json_decode(file_get_contents("php://input"), true);

// Extract fields for the new user (tenant)
$user_name = $data['user_name'] ?? null;
$email = $data['email'] ?? null;
$phone_number = $data['phone_number'] ?? null;
$emergency_contact_name = $data['emergency_contact_name'] ?? null;
$emergency_contact_phone = $data['emergency_contact_phone'] ?? null;

// Basic validation
if (!$user_name || !$email) {
    http_response_code(400);
    echo json_encode([
        "status" => "error", 
        "message" => "Missing required fields: user_name or email"
    ]);
    exit;
}

try {
    // Check if user already exists (optional but recommended)
    $check_query = "SELECT user_ID FROM users WHERE email = :email LIMIT 0,1";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":email", $email);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode([
            "status" => "error", 
            "message" => "User with this email already exists."
        ]);
        exit;
    }

    // CREATE new user
    $query = "INSERT INTO users (
                  user_name, email, phone_number,
                  emergency_contact_name, emergency_contact_phone
              ) VALUES (
                  :user_name, :email, :phone_number,
                  :emergency_contact_name, :emergency_contact_phone
              )";

    $stmt = $db->prepare($query);
    
    // Bind parameters
    $stmt->bindParam(":user_name", $user_name);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":phone_number", $phone_number);
    $stmt->bindParam(":emergency_contact_name", $emergency_contact_name);
    $stmt->bindParam(":emergency_contact_phone", $emergency_contact_phone);

    // Execute and respond
    if ($stmt->execute()) {
        $user_ID = $db->lastInsertId();
        http_response_code(201);
        echo json_encode([
            "status" => "success", 
            "message" => "Tenant created successfully",
            "user_ID" => $user_ID
        ]);
    } else {
        throw new Exception("Database operation failed");
    }
} catch (Exception $e) {
    // Log the error for debugging
    // error_log("User creation failed: " . $e->getMessage()); 
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?>