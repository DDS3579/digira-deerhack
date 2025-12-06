<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$raw_input = file_get_contents("php://input");
error_log("Raw input received: " . $raw_input);


$data = json_decode($raw_input);

error_log("Decoded data: " . print_r($data, true));


if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("JSON decode error: " . json_last_error_msg());
    http_response_code(400);
    echo json_encode(array("message" => "Invalid JSON format. Error: " . json_last_error_msg()));
    exit();
}


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


error_log("Phone present: " . (isset($data->phone) ? "Yes: " . $data->phone : "No"));
error_log("Password present: " . (isset($data->password) ? "Yes" : "No"));
error_log("User_type present: " . (isset($data->user_type) ? "Yes: " . $data->user_type : "No"));

if(!empty($data->phone) && !empty($data->password) && !empty($data->user_type)) {
    
    error_log("All required fields present. Proceeding with login...");
    
    if($data->user_type === 'ward_admin') {
        $query = "SELECT id, ward_official_name, ward_no, admin_phone, password_hash, status 
                  FROM wards 
                  WHERE admin_phone = :phone";
        error_log("Query for ward admin");
    } else {
        $query = "SELECT id, first_name, last_name, phone, password_hash, status 
                  FROM users 
                  WHERE phone = :phone";
        error_log("Query for normal user");
    }

    $stmt = $db->prepare($query);
    $stmt->bindParam(':phone', $data->phone);
    $stmt->execute();

    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        error_log("User found in database");
        
        if(password_verify($data->password, $row['password_hash'])) {
            error_log("Password verified successfully");
            
            if($data->user_type === 'ward_admin' && $row['status'] !== 'approved') {
                http_response_code(403);
                echo json_encode(array("message" => "Account pending approval."));
                exit();
            }
            
            if($row['status'] === 'inactive') {
                http_response_code(403);
                echo json_encode(array("message" => "Account is inactive."));
                exit();
            }

            unset($row['password_hash']);
            
            if($data->user_type === 'ward_admin') {
                $response = array(
                    "message" => "Login successful",
                    "user_type" => "ward_admin",
                    "user" => array(
                        "id" => $row['id'],
                        "ward_official_name" => $row['ward_official_name'],
                        "ward_no" => $row['ward_no'],
                        "admin_phone" => $row['admin_phone']
                    )
                );
            } else {
                $response = array(
                    "message" => "Login successful",
                    "user_type" => "user",
                    "user" => array(
                        "id" => $row['id'],
                        "first_name" => $row['first_name'],
                        "last_name" => $row['last_name'],
                        "phone" => $row['phone']
                    )
                );
            }
            
            http_response_code(200);
            echo json_encode($response);
        } else {
            error_log("Password verification failed");
            http_response_code(401);
            echo json_encode(array("message" => "Invalid credentials."));
        }
    } else {
        error_log("No user found with phone: " . $data->phone);
        http_response_code(404);
        echo json_encode(array("message" => "User not found."));
    }
} else {
    // More detailed error message
    $missing_fields = [];
    if(empty($data->phone)) $missing_fields[] = "phone";
    if(empty($data->password)) $missing_fields[] = "password";
    if(empty($data->user_type)) $missing_fields[] = "user_type";
    
    error_log("Missing fields: " . implode(", ", $missing_fields));
    
    http_response_code(400);
    echo json_encode(array(
        "message" => "Incomplete data.",
        "missing_fields" => $missing_fields,
        "received_data" => $data
    ));
}
?>