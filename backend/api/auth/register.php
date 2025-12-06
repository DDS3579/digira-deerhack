<?php
require_once '../../config/database.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: 0");
$database = new Database();
$db = $database->getConnection();


$raw_input = file_get_contents("php://input");
error_log("User Register request received: " . $raw_input);


$data = json_decode($raw_input);


if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        "message" => "Invalid JSON format",
        "error" => json_last_error_msg()
    ]);
    exit();
}


if (empty($data->first_name) || 
    empty($data->last_name) || 
    empty($data->house_no) ||
    empty($data->phone) ||
    empty($data->profession) ||
    empty($data->ward_id) ||
    empty($data->tole_name) ||
    empty($data->password)) {
    
    $missing_fields = [];
    if (empty($data->first_name)) $missing_fields[] = "first_name";
    if (empty($data->last_name)) $missing_fields[] = "last_name";
    if (empty($data->house_no)) $missing_fields[] = "house_no";
    if (empty($data->phone)) $missing_fields[] = "phone";
    if (empty($data->profession)) $missing_fields[] = "profession";
    if (empty($data->ward_id)) $missing_fields[] = "ward_id";
    if (empty($data->tole_name)) $missing_fields[] = "tole_name";
    if (empty($data->password)) $missing_fields[] = "password";
    
    http_response_code(400);
    echo json_encode([
        "message" => "Incomplete data",
        "missing_fields" => $missing_fields
    ]);
    exit();
}

try {

    $check_query = "SELECT id FROM users WHERE phone = :phone";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':phone', $data->phone);
    $check_stmt->execute();
    
    if($check_stmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(["message" => "Phone number already registered."]);
        exit();
    }

    $ward_query = "SELECT id FROM wards WHERE id = :ward_id AND status = 'approved'";
    $ward_stmt = $db->prepare($ward_query);
    $ward_stmt->bindParam(':ward_id', $data->ward_id);
    $ward_stmt->execute();
    
    if($ward_stmt->rowCount() == 0) {
        http_response_code(400);
        echo json_encode(["message" => "Ward not found or not approved."]);
        exit();
    }

    $tole_query = "SELECT id FROM toles WHERE ward_id = :ward_id AND tole_name = :tole_name";
    $tole_stmt = $db->prepare($tole_query);
    $tole_stmt->bindParam(':ward_id', $data->ward_id);
    $tole_stmt->bindParam(':tole_name', $data->tole_name);
    $tole_stmt->execute();
    
    if($tole_stmt->rowCount() > 0) {
        $tole = $tole_stmt->fetch(PDO::FETCH_ASSOC);
        $tole_id = $tole['id'];
    } else {

        $insert_tole = "INSERT INTO toles (ward_id, tole_name) VALUES (:ward_id, :tole_name)";
        $insert_stmt = $db->prepare($insert_tole);
        $insert_stmt->bindParam(':ward_id', $data->ward_id);
        $insert_stmt->bindParam(':tole_name', $data->tole_name);
        
        if (!$insert_stmt->execute()) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to create tole."]);
            exit();
        }
        
        $tole_id = $db->lastInsertId();
    }

    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    $query = "INSERT INTO users 
              (first_name, last_name, house_no, phone, profession, ward_id, tole_id, password_hash) 
              VALUES 
              (:first_name, :last_name, :house_no, :phone, :profession, :ward_id, :tole_id, :password_hash)";

    $stmt = $db->prepare($query);

    $stmt->bindParam(':first_name', $data->first_name);
    $stmt->bindParam(':last_name', $data->last_name);
    $stmt->bindParam(':house_no', $data->house_no);
    $stmt->bindParam(':phone', $data->phone);
    $stmt->bindParam(':profession', $data->profession);
    $stmt->bindParam(':ward_id', $data->ward_id);
    $stmt->bindParam(':tole_id', $tole_id);
    $stmt->bindParam(':password_hash', $password_hash);

    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "User registered successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to register user."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>