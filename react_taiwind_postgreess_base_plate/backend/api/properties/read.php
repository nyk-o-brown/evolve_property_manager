<?php
// backend/api/properties/read.php
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/Database.php';
include_once '../../models/Property.php';

$database = new Database();
$db = $database->getConnection();

$property = new Property($db);
$stmt = $property->read();
$num = $stmt->rowCount();

if($num > 0) {
    $properties_arr = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $property_item = array(
            "id" => $id,
            "title" => $title,
            "price" => $price,
            "location" => $location
        );
        array_push($properties_arr, $property_item);
    }
    http_response_code(200);
    echo json_encode($properties_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No properties found."));
}