<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
    exit;
}

require_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get input data
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;

    // Validate input
    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Email and password are required"
        ]);
        exit;
    }

    // Query to get tenant with their unit and property info
    $query = "SELECT 
                u.user_ID,
                u.user_name,
                u.email,
                u.phone_number,
                u.emergency_contact_name,
                u.emergency_contact_phone,
                pu.unit_ID,
                pu.unit_name,
                pu.property_ID,
                pu.rent_price,
                pu.tenant_status,
                pu.lease_start_date,
                pu.lease_end_date,
                pu.security_deposit,
                p.property_name,
                p.location,
                p.description
              FROM users u
              LEFT JOIN properties_units pu ON pu.tenant_ID = u.user_ID
              LEFT JOIN properties p ON p.property_ID = pu.property_ID
              WHERE u.email = :email
              LIMIT 1";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        http_response_code(401);
        echo json_encode([
            "status" => "error",
            "message" => "Invalid email or password"
        ]);
        exit;
    }

    $tenant = $stmt->fetch(PDO::FETCH_ASSOC);

    // In production, you should verify hashed password
    // For now, using plain text comparison (NOT SECURE - DEMO ONLY)
    // You should use: password_verify($password, $tenant['password_hash'])
    
    // For demo purposes, accepting any password for existing email
    // IMPORTANT: Implement proper password hashing in production!
    
    // Create session token
    $token = bin2hex(random_bytes(32));

    // Return tenant data
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Login successful",
        "token" => $token,
        "tenant" => [
            "user_ID" => $tenant['user_ID'],
            "user_name" => $tenant['user_name'],
            "email" => $tenant['email'],
            "phone_number" => $tenant['phone_number'],
            "emergency_contact_name" => $tenant['emergency_contact_name'],
            "emergency_contact_phone" => $tenant['emergency_contact_phone'],
            "unit" => [
                "unit_ID" => $tenant['unit_ID'],
                "unit_name" => $tenant['unit_name'],
                "rent_price" => $tenant['rent_price'],
                "tenant_status" => $tenant['tenant_status'],
                "lease_start_date" => $tenant['lease_start_date'],
                "lease_end_date" => $tenant['lease_end_date'],
                "security_deposit" => $tenant['security_deposit']
            ],
            "property" => [
                "property_ID" => $tenant['property_ID'],
                "property_name" => $tenant['property_name'],
                "location" => $tenant['location'],
                "description" => $tenant['description']
            ]
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?>