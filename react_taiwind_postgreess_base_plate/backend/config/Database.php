<?php

class Database {
    private $host;
    private $database_name;
    private $port;
    private $username;
    private $password;
    
    public function __construct() {
        // Load .env file
        $this->loadEnv();
        
        // Set database credentials from environment or use defaults
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->port = getenv('DB_PORT') ?: '3306';
        $this->database_name = getenv('DB_NAME') ?: 'property_manager';
        $this->username = getenv('DB_USER') ?: 'root';
        $this->password = getenv('DB_PASSWORD') ?: '';
    }
    
    /**
     * Load environment variables from .env file
     */
    private function loadEnv() {
        // Path to .env file (2 levels up from config/ folder)
        $envPath = __DIR__ . '/../../.env';
        
        if (!file_exists($envPath)) {
            error_log("Warning: .env file not found at: $envPath");
            error_log("Using default database values.");
            return;
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            // Skip comments
            if (strpos(trim($line), '#') === 0) {
                continue;
            }

            // Parse KEY=VALUE
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remove quotes if present
                $value = trim($value, '"\'');
                
                // Set environment variable
                putenv("$key=$value");
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }
    
    public function getConnection() {
        try {
            $dsn = "mysql:host=" . $this->host . 
                   ";port=" . $this->port . 
                   ";dbname=" . $this->database_name . 
                   ";charset=utf8mb4";
            
            $conn = new PDO($dsn, $this->username, $this->password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
            return $conn;
        } catch(PDOException $e) {
            error_log("Connection error: " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Test database connection (for CLI testing)
     */
    public function testConnection() {
        try {
            $conn = $this->getConnection();
            if ($conn) {
                echo "✓ Database connection successful!\n";
                echo "  Host: {$this->host}:{$this->port}\n";
                echo "  Database: {$this->database_name}\n";
                echo "  User: {$this->username}\n";
                return true;
            }
        } catch (Exception $e) {
            echo "✗ Database connection failed!\n";
            echo "  Error: " . $e->getMessage() . "\n";
            return false;
        }
    }
}

// Allow running this file directly to test connection
if (php_sapi_name() === 'cli' && basename(__FILE__) === basename($_SERVER['PHP_SELF'])) {
    echo "\n=== Database Connection Test ===\n\n";
    $db = new Database();
    $db->testConnection();
    echo "\n";
}