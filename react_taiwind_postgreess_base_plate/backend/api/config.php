<?php
// config.php — update these to match your environment
$db_host = '127.0.0.1';
$db_port = '3306'; // use 3306 for MySQL
$db_name = 'property_manager';
$db_user = 'root';
$db_pass = '';
$dsn = "mysql:host=$db_host;port=$db_port;dbname=$db_name"; // change to "mysql:host=...;dbname=..." for MySQL

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'DB connection failed']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: * ');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
