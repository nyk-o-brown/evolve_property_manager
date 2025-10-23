<?php
require_once __DIR__ . '/../config.php';

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    exit;
}

$required = ['unit_ID','name','phone_number','email','emergency_contact_name','emergency_contact_phone'];
foreach ($required as $r) {
    if (empty($body[$r])) {
        echo json_encode(['status' => 'error', 'message' => "$r is required"]);
        exit;
    }
}

try {
    $pdo->beginTransaction();

    // Insert user
    $sqlUser = "INSERT INTO users (name, phone_number, email, emergency_contact_name, emergency_contact_phone) VALUES (:name,:phone,:email,:e_name,:e_phone) RETURNING user_ID;";
    $stmt = $pdo->prepare($sqlUser);
    $stmt->execute([
        'name' => $body['name'],
        'phone' => $body['phone_number'],
        'email' => $body['email'],
        'e_name' => $body['emergency_contact_name'],
        'e_phone' => $body['emergency_contact_phone']
    ]);
    $userIdRow = $stmt->fetch();
    $newUserId = $userIdRow ? $userIdRow['user_ID'] : $pdo->lastInsertId();

    // Update unit to assign tenant
    $sqlUpdateUnit = "UPDATE properties_units SET tenant_ID = :tenant_ID, tenant_since = CURRENT_DATE, tenant_status = :tenant_status WHERE unit_ID = :unit_ID";
    $stmt = $pdo->prepare($sqlUpdateUnit);
    $stmt->execute([
        'tenant_ID' => $newUserId,
        'tenant_status' => $body['tenant_status'] ?? 'occupied',
        'unit_ID' => $body['unit_ID']
    ]);

    $pdo->commit();
    echo json_encode(['status' => 'success', 'message' => 'Tenant created and assigned', 'user_ID' => $newUserId]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to create tenant']);
}
