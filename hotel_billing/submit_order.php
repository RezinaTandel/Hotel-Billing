<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$database = "hotel_bill";

// Create connection to MySQL server
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connection successful<br>";

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS $database";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully or already exists<br>";
} else {
    echo "Error creating database: " . $conn->error;
}

// Select the database
$conn->select_db($database);

// Create table (renamed to `orders`)
$sql = "CREATE TABLE IF NOT EXISTS `orders` (
    `username` VARCHAR(50) NOT NULL,
    `mobile_number` VARCHAR(15),
    `address` VARCHAR(255),
    `total_price` DECIMAL(10,2),
    PRIMARY KEY (`username`)
)";
if ($conn->query($sql) === TRUE) {
    echo "Table created successfully<br>";
} else {
    echo "Error creating table: " . $conn->error;
}


$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON"]);
    exit;
}

$name = $conn->real_escape_string($data['name']);
$mobile = $conn->real_escape_string($data['mobile']);
$address = $conn->real_escape_string($data['address']);
$total = floatval($data['total']);

// Insert sample data
$sql = "INSERT INTO `orders` 
(`username`, `mobile_number`, `address`, `total_price`) 
VALUES ('$name', '$mobile', '$address', '$total')";
if ($conn->query($sql) === TRUE) {
    echo "Data inserted successfully<br>";
} else {
    echo "Error inserting data: " . $conn->error;
}

$conn->close();
?>
