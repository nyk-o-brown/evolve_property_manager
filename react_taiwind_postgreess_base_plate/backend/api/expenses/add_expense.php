<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../../../config/Database.php';

try {
    $db = (new Database())->getConnection();
    $data = json_decode(file_get_contents("php://input"), true);

    $sql = "INSERT INTO expenses (user_ID, property_ID, date, time, amount, description, account, month)
            VALUES (:user_ID, :property_ID, :date, :time, :amount, :description, :account, :month)";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ":user_ID" => $data["user_ID"],
        ":property_ID" => $data["property_ID"],
        ":date" => $data["date"],
        ":time" => $data["time"],
        ":amount" => $data["amount"],
        ":description" => $data["description"],
        ":account" => $data["account"],
        ":month" => $data["month"],
    ]);

    echo json_encode(["status" => "success"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
