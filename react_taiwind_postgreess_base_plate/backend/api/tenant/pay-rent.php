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
    
    if(!isset($data->tenant_id) || !isset($data->unit_id) || !isset($data->amount)) {
        throw new Exception("Missing required fields");
    }

    // Insert payment record
    $query = "
        INSERT INTO payments 
        (tenant_ID, unit_ID, amount, status, date, time) 
        VALUES (?, ?, ?, 'complete', CURRENT_DATE(), CURRENT_TIME())
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute([
        $data->tenant_id,
        $data->unit_id,
        $data->amount
    ]);

    // Get updated rent status
    $query = "
        SELECT amount, status, date
        FROM payments
        WHERE tenant_ID = ?
        ORDER BY date DESC
        LIMIT 1
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute([$data->tenant_id]);
    $rentStatus = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'message' => 'Payment recorded successfully',
        'rentStatus' => $rentStatus
    ]);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}