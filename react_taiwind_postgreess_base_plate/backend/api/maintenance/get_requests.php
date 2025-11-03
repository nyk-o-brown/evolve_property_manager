<?php
// File: backend/api/maintenance/get_requests.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $query = "
        SELECT
            m.maintenance_ID,
            m.description,
            m.date,
            m.photo_URL,
            prop.property_name,
            pu.unit_name,
            m.status
        FROM maintenance m
        LEFT JOIN properties prop ON prop.property_ID = m.property_ID
        LEFT JOIN properties_units pu ON pu.unit_ID = m.unit_ID
        ORDER BY m.date DESC
        LIMIT 100
    ";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $requests = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $requests[] = [
            "id" => $row["maintenance_ID"],
            "issue" => $row["description"],
            "submittedDate" => $row["date"],
            "property" => $row["property_name"] ?? "Unknown Property",
            "unit" => $row["unit_name"] ?? "",
            "photo" => $row["photo_URL"] ?? null,
            "status" => $row["status"] ?? "Pending"
        ];
    }

    echo json_encode(["requests" => $requests]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
}
