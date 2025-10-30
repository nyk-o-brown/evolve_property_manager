<?php
// backend/api/payments/get_payments.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php'; // adjust path if needed

try {
    $database = new Database();
    $db = $database->getConnection();

    // Example query: join payments -> properties_units -> properties -> users (tenants)
    $query = "
        SELECT
            p.payment_ID AS payment_id,
            p.amount AS amount,
            p.status AS status,
            p.invoice_id AS invoice_id,
            p.created_at AS date,
            u.user_name AS tenant_name,
            u.email AS tenant_email,
            prop.property_name AS property_name,
            prop.address AS property_address,
            pu.unit_name AS unit_name
        FROM payments p
        LEFT JOIN users u ON u.user_ID = p.user_ID
        LEFT JOIN properties_units pu ON pu.unit_ID = p.unit_ID
        LEFT JOIN properties prop ON prop.property_ID = pu.property_ID
        ORDER BY p.created_at DESC
        LIMIT 200
    ";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $payments = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $payments[] = [
            "id" => $row["payment_id"],
            "amount" => (float)$row["amount"],
            "status" => $row["status"],
            "invoice_id" => $row["invoice_id"],
            "date" => $row["date"],
            "tenant_name" => $row["tenant_name"],
            "tenant_email" => $row["tenant_email"],
            "property_name" => $row["property_name"],
            "property_address" => $row["property_address"],
            "unit_name" => $row["unit_name"]
        ];
    }

    echo json_encode(["payments" => $payments]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
}
