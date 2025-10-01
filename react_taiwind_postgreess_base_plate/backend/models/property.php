<?php
// backend/models/Property.php
<?php
class Property {
    private $conn;
    private $table_name = "properties";

    public $id;
    public $title;
    public $price;
    public $location;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create property
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    title = :title,
                    price = :price,
                    location = :location";

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->location = htmlspecialchars(strip_tags($this->location));

        // Bind values
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":location", $this->location);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Read all properties
    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}