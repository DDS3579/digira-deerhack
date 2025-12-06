<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();


$content = file_get_contents("php://input");
$data = json_decode($content);


if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        "message" => "Invalid JSON format",
        "error" => json_last_error_msg()
    ]);
    exit();
}


if (empty($data->phone) || empty($data->password) || empty($data->user_type)) {
    http_response_code(400);
    echo json_encode([
        "message" => "Missing required fields",
        "required" => ["phone", "password", "user_type"]
    ]);
    exit();
}


$phone = trim($data->phone);
$password = trim($data->password);
$user_type = trim($data->user_type);

if ($user_type === 'ward_admin') {
    $query = "SELECT id, ward_official_name, ward_no, admin_phone, password_hash, status 
              FROM wards 
              WHERE admin_phone = :phone";
} else {
    $query = "SELECT id, first_name, last_name, phone, password_hash, status 
              FROM users 
              WHERE phone = :phone";
}

try {
    $stmt = $db->prepare($query);
    $stmt->bindParam(':phone', $phone);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify($password, $row['password_hash'])) {
            
            if ($user_type === 'ward_admin' && $row['status'] !== 'approved') {
                http_response_code(403);
                echo json_encode(["message" => "Account pending approval."]);
                exit();
            }

            if ($row['status'] === 'inactive') {
                http_response_code(403);
                echo json_encode(["message" => "Account is inactive."]);
                exit();
            }

            unset($row['password_hash']);
            
            if ($user_type === 'ward_admin') {
                $response = [
                    "message" => "Login successful",
                    "user_type" => "ward_admin",
                    "user" => [
                        "id" => $row['id'],
                        "ward_official_name" => $row['ward_official_name'],
                        "ward_no" => $row['ward_no'],
                        "admin_phone" => $row['admin_phone']
                    ]
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
                    ]
                ];
            }
            
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid password."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "User not found."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>