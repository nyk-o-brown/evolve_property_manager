<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');

require_once '../../config/Database.php';

try {
    // Get property ID from query string
    $propertyId = isset($_GET['id']) ? $_GET['id'] : die();

    // Create DB connection
    $database = new Database();
    $conn = $database->connect();

    // Prepare the query
    $query = "SELECT * FROM property_units WHERE property_id = :property_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':property_id', $propertyId);
    
    // Execute query
    $stmt->execute();
    
    $units = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Check if any units were found
    if ($units) {
        echo json_encode([
            'status' => 'success',
            'units' => $units
        ]);
    } else {
        echo json_encode([
            'status' => 'success',
            'units' => []
        ]);
    }

} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database Error: ' . $e->getMessage()
    ]);
}
?>