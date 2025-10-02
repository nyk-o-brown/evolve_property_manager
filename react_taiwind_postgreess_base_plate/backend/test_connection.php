<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/config/Database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    echo "✅ Database connection successful!\n";
    
    // Test a simple query
    $stmt = $conn->query("SELECT 1");
    $result = $stmt->fetch();
    echo "✅ Test query executed successfully!\n";
    
    // Test properties table
    $stmt = $conn->query("SELECT COUNT(*) as count FROM properties");
    $result = $stmt->fetch();
    echo "✅ Properties table accessible. Found {$result['count']} properties.\n";
    
} catch(PDOException $e) {
    echo "❌ Connection failed: " . $e->getMessage() . "\n";
}