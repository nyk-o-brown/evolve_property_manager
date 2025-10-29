<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';
$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"), true);

// Extract user fields
$user_name = $data['user_name'] ?? null;
$email = $data['email'] ?? null;
$phone_number = $data['phone_number'] ?? null;
$emergency_contact_name = $data['emergency_contact_name'] ?? null;
$emergency_contact_phone = $data['emergency_contact_phone'] ?? null;

// Extract unit fields
$unit_ID = $data['unit_ID'] ?? null;
$property_ID = $data['property_ID'] ?? null;
$unit_name = $data['unit_name'] ?? null;
$rent_price = $data['rent_price'] ?? null;
$lease_start_date = $data['lease_start_date'] ?? null;
$lease_end_date = $data['lease_end_date'] ?? null;
$security_deposit = $data['security_deposit'] ?? null;
$tenant_status = $data['tenant_status'] ?? 'occupied';

if (!$user_name || !$email || !$unit_ID || !$property_ID || !$unit_name || !$rent_price || !$lease_start_date || !$lease_end_date) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields for user or unit"
    ]);
    exit;
}

try {
    // Check if unit exists
    $check_unit = $db->prepare("SELECT unit_ID FROM properties_units WHERE unit_ID = :unit_ID");
    $check_unit->bindParam(":unit_ID", $unit_ID);
    $check_unit->execute();
    if ($check_unit->rowCount() === 0) {
        throw new Exception("Unit not found");
    }

    // Check for existing user
    $check_user = $db->prepare("SELECT user_ID FROM users WHERE email = :email LIMIT 1");
    $check_user->bindParam(":email", $email);
    $check_user->execute();
    if ($check_user->rowCount() > 0) {
        http_response_code(409);
        echo json_encode([
            "status" => "error",
            "message" => "User with this email already exists."
        ]);
        exit;
    }

    // Create user
    $user_query = "INSERT INTO users (
        user_name, email, phone_number,
        emergency_contact_name, emergency_contact_phone
    ) VALUES (
        :user_name, :email, :phone_number,
        :emergency_contact_name, :emergency_contact_phone
    )";
    $user_stmt = $db->prepare($user_query);
    $user_stmt->bindParam(":user_name", $user_name);
    $user_stmt->bindParam(":email", $email);
    $user_stmt->bindParam(":phone_number", $phone_number);
    $user_stmt->bindParam(":emergency_contact_name", $emergency_contact_name);
    $user_stmt->bindParam(":emergency_contact_phone", $emergency_contact_phone);

    if ($user_stmt->execute()) {
        $user_ID = $db->lastInsertId();

        // Update unit with tenant info
        $update_query = "UPDATE properties_units SET
            user_ID = :user_ID,
            tenant_ID = :tenant_ID,
            tenant_status = :tenant_status,
            lease_start_date = :lease_start_date,
            lease_end_date = :lease_end_date,
            security_deposit = :security_deposit
        WHERE unit_ID = :unit_ID";

        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindParam(":user_ID", $user_ID);
        $update_stmt->bindParam(":tenant_ID", $user_ID);
        $update_stmt->bindParam(":tenant_status", $tenant_status);
        $update_stmt->bindParam(":lease_start_date", $lease_start_date);
        $update_stmt->bindParam(":lease_end_date", $lease_end_date);
        $update_stmt->bindParam(":security_deposit", $security_deposit);
        $update_stmt->bindParam(":unit_ID", $unit_ID);

        if ($update_stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "status" => "success",
                "message" => "Tenant assigned and unit updated",
                "user_ID" => $user_ID,
                "unit_ID" => $unit_ID
            ]);
        } else {
            throw new Exception("Failed to update unit");
        }
    } else {
        throw new Exception("Failed to create user");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?>
