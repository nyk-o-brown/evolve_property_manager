<?php
// backend/api/properties/read.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// For debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once '../../config/Database.php';
include_once '../../models/Property.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $property = new Property($db);
    $stmt = $property->read();
    
    // Debug log
    error_log("Query executed. Row count: " . $stmt->rowCount());
    
    $properties_arr = array();
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $property_item = array(
            "id" => $row['id'],
            "title" => $row['title'],
            "price" => $row['price'],
            "location" => $row['location'],
            "image" => $row['image'] ?? null,
            "beds" => $row['beds'] ?? null,
            "baths" => $row['baths'] ?? null,
            "sqft" => $row['sqft'] ?? null
        );
        array_push($properties_arr, $property_item);
    }
    
    http_response_code(200);
    echo json_encode($properties_arr);
    
} catch (Exception $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array(
        "message" => "Unable to fetch properties.",
        "error" => $e->getMessage()
    ));
}