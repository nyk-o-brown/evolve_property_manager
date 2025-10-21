<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get posted data
    $data = json_decode(file_get_contents("php://input"));
    
    // Validate required fields
    if(!isset($data->first_name) || !isset($data->last_name) || !isset($data->email)) {
        throw new Exception("Missing required fields");
    }

    // Start transaction
    $db->beginTransaction();

    try {
        // First, create user record
        $query = "INSERT INTO users 
                  (user_name, email) 
                  VALUES 
                  (:user_name, :email)";
        
        $stmt = $db->prepare($query);
        
        $user_name = $data->first_name . ' ' . $data->last_name;
        
        $stmt->bindParam(":user_name", $user_name);
        $stmt->bindParam(":email", $data->email);
        
        if(!$stmt->execute()) {
            throw new Exception("Failed to create user record");
        }
        
        $user_id = $db->lastInsertId();

        // Update property unit with tenant
        $query = "UPDATE properties_units 
                  SET tenant_ID = :tenant_id,
                      tenant_status = 'occupied'
                  WHERE unit_ID = :unit_id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":tenant_id", $user_id);
        $stmt->bindParam(":unit_id", $data->unit_id);
        
        if(!$stmt->execute()) {
            throw new Exception("Failed to assign unit to tenant");
        }

        // Commit transaction
        $db->commit();

        // Get the tenant details to return
        $query = "SELECT 
                    u.user_ID,
                    u.user_name,
                    u.email,
                    pu.unit_ID,
                    pu.unit_name,
                    p.property_name
                  FROM users u
                  JOIN properties_units pu ON pu.tenant_ID = u.user_ID
                  JOIN properties p ON p.property_ID = pu.property_ID
                  WHERE u.user_ID = ?";
        
        $stmt = $db->prepare($query);
        $stmt->execute([$user_id]);
        $tenant = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => "success",
            "message" => "Tenant created successfully",
            "tenant" => $tenant
        ]);

    } catch(Exception $e) {
        $db->rollBack();
        throw $e;
    }

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}