<?php
header("Access-Control-Allow-Origin: ");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Handle image upload
    $image_url = null;
    if(isset($_FILES['image'])) {
        $target_dir = "../../../uploads/properties/";
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
        
        $file_extension = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
        $file_name = uniqid() . '.' . $file_extension;
        $target_file = $target_dir . $file_name;
        
        // Check file size and type
        if ($_FILES["image"]["size"] > 5000000) {
            throw new Exception("File is too large. Maximum size is 5MB.");
        }
        
        $allowed_types = array('jpg', 'jpeg', 'png', 'gif');
        if (!in_array($file_extension, $allowed_types)) {
            throw new Exception("Only JPG, JPEG, PNG & GIF files are allowed.");
        }
        
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            $image_url = '/uploads/properties/' . $file_name;
        }
    }

    // Insert property
    $query = "INSERT INTO properties 
              (property_name, location, description, rent, price, image_URL) 
              VALUES 
              (:property_name, :location, :description, :rent, :price, :image_url)";

    $stmt = $db->prepare($query);
    
    $stmt->bindParam(":property_name", $_POST['property_name']);
    $stmt->bindParam(":location", $_POST['location']);
    $stmt->bindParam(":description", $_POST['description']);
    $stmt->bindParam(":rent", $_POST['rent']);
    $stmt->bindParam(":price", $_POST['price']);
    $stmt->bindParam(":image_url", $image_url);

    if($stmt->execute()) {
        $property_id = $db->lastInsertId();
        
        // Get the created property
        $query = "SELECT * FROM properties WHERE property_ID = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$property_id]);
        $property = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            "status" => "success",
            "message" => "Property created successfully",
            "property" => $property
        ]);
    } else {
        throw new Exception("Unable to create property");
    }

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
