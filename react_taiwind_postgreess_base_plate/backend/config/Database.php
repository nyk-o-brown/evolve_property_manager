<?php

class Database {
    private $host = "localhost";
    private $database_name = "property_manager";
    private $port ="3306";
    private $username = "root";
    private $password = "##&&oracleNyakako7050#";
    
    public function getConnection() {
        try {
            $conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database_name,
                $this->username,
                $this->password
            );
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch(PDOException $e) {
            error_log("Connection error: " . $e->getMessage());
            throw $e;
        }
    }
}