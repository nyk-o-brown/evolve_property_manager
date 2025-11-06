<?php
// public/api/expenses.php
header('Content-Type: application/json; charset=utf-8');
http_response_code(200);

// Simple auth check example (replace with real auth)
if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
    // optional: return 401;
    // echo json_encode(["error" => "Unauthorized"]);
    // exit;
}

$dbHost = '127.0.0.1';
$dbName = 'your_database';
$dbUser = 'your_user';
$dbPass = 'your_password';
$dsn = "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Basic query - join with users or properties if needed
    $stmt = $pdo->prepare("
        SELECT
          expenses_ID,
          user_ID,
          property_ID,
          date,
          time,
          amount,
          description,
          account,
          month
        FROM expenses
        ORDER BY date DESC, time DESC
        LIMIT 100
    ");
    $stmt->execute();
    $rows = $stmt->fetchAll();

    echo json_encode($rows);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error"]);
}
