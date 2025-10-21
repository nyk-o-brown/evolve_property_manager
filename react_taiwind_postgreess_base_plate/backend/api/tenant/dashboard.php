<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $tenant_id = isset($_GET['id']) ? $_GET['id'] : die();

    // Get tenant unit info
    $query = "
        SELECT 
            pu.unit_ID,
            pu.unit_name as unit_number,
            pu.rent_price,
            p.property_name,
            p.property_ID
        FROM properties_units pu
        JOIN properties p ON p.property_ID = pu.property_ID
        WHERE pu.tenant_ID = ?
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute([$tenant_id]);
    $unit = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get rent status
    $query = "
        SELECT amount, status, date
        FROM payments
        WHERE tenant_ID = ?
        ORDER BY date DESC
        LIMIT 1
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute([$tenant_id]);
    $rentStatus = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get notifications
    $query = "
        SELECT m.*
        FROM maintenance m
        WHERE m.tenant_ID = ?
        ORDER BY date DESC
        LIMIT 5
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute([$tenant_id]);
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'unit' => $unit,
        'rentStatus' => $rentStatus,
        'notifications' => $notifications
    ]);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}