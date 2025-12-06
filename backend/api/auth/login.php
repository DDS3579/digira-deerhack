<?php
// ========== CORS HEADERS ==========
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Accept");
    header("Access-Control-Max-Age: 86400");
    http_response_code(200);
    exit();
}

// Regular request headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Disable caching completely
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: 0");
// Prevent ETag and Last-Modified headers that could cause 304 responses
header_remove("ETag");
header_remove("Last-Modified");

// Include database
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get POST data
$raw_input = file_get_contents("php://input");

// Log for debugging
error_log("Login attempt at " . date('Y-m-d H:i:s'));

// Decode JSON
$data = json_decode($raw_input);

// Check if JSON is valid
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        "message" => "Invalid JSON format",
        "error" => json_last_error_msg()
    ]);
    exit();
}

// Check required fields
if (empty($data->phone) || empty($data->password) || empty($data->user_type)) {
    http_response_code(400);
    echo json_encode([
        "message" => "Incomplete data",
        "required_fields" => ["phone", "password", "user_type"]
    ]);
    exit();
}

// Trim inputs
$phone = trim($data->phone);
$password = trim($data->password);
$user_type = trim($data->user_type);

try {
    // Determine which table to query
    if ($user_type === 'ward_admin') {
        $query = "SELECT id, ward_official_name, ward_no, admin_phone, password_hash, status 
                  FROM wards 
                  WHERE admin_phone = :phone";
    } else {
        $query = "SELECT id, first_name, last_name, phone, password_hash, status 
                  FROM users 
                  WHERE phone = :phone";
    }

    $stmt = $db->prepare($query);
    $stmt->bindParam(':phone', $phone);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify($password, $row['password_hash'])) {
            
            // Check if ward admin is approved
            if ($user_type === 'ward_admin' && $row['status'] !== 'approved') {
                http_response_code(403);
                echo json_encode([
                    "message" => "Account pending approval."
                ]);
                exit();
            }
            
            // Check if account is inactive
            if ($row['status'] === 'inactive') {
                http_response_code(403);
                echo json_encode([
                    "message" => "Account is inactive."
                ]);
                exit();
            }

            // Prepare response
            unset($row['password_hash']);
            
            // Add unique timestamp to prevent caching
            $timestamp = time();
            $microtime = microtime(true);
            
            if ($user_type === 'ward_admin') {
                $response = [
                    "message" => "Login successful",
                    "user_type" => "ward_admin",
                    "user" => [
                        "id" => $row['id'],
                        "ward_official_name" => $row['ward_official_name'],
                        "ward_no" => $row['ward_no'],
                        "admin_phone" => $row['admin_phone']
                    ],
                    "timestamp" => $timestamp,
                    "microtime" => $microtime
                ];
            } else {
                $response = [
                    "message" => "Login successful",
                    "user_type" => "user",
                    "user" => [
                        "id" => $row['id'],
                        "first_name" => $row['first_name'],
                        "last_name" => $row['last_name'],
                        "phone" => $row['phone']
                    ],
                    "timestamp" => $timestamp,
                    "microtime" => $microtime
                ];
            }
            
            http_response_code(200);
            echo json_encode($response);
            
        } else {
            http_response_code(401);
            echo json_encode([
                "message" => "Invalid credentials."
            ]);
        }
    } else {
        http_response_code(404);
        echo json_encode([
            "message" => "User not found."
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>