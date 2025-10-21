<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $data = json_decode(file_get_contents("php://input"));
    
    if(!isset($data->tenant_id) || !isset($data->unit_id) || !isset($data->description)) {
        throw new Exception("Missing required fields");
    }

    // Insert maintenance request
    $query = "
        INSERT INTO maintenance 
        (tenant_ID, unit_ID, description, date) 
        VALUES (?, ?, ?, CURRENT_DATE())
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute([
        $data->tenant_id,
        $data->unit_id,
        $data->description
    ]);

    $maintenance_id = $db->lastInsertId();

    // Get the created maintenance request
    $query = "
        SELECT *
        FROM maintenance
        WHERE maintenance_ID = ?
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute([$maintenance_id]);
    $notification = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'message' => 'Maintenance request submitted successfully',
        'notification' => $notification
    ]);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}