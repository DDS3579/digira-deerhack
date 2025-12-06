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
// Get the database connection
$database = new Database();
$db = $database->getConnection();

// Get raw POST data
$raw_input = file_get_contents("php://input");
error_log("Ward Admin Register request received: " . $raw_input);

// Decode JSON
$data = json_decode($raw_input);

// Check if JSON is valid
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        "message" => "Invalid JSON format",
        "error" => json_last_error_msg(),
        "received" => $raw_input
    ]);
    exit();
}

// Check all required fields exist
if (empty($data->ward_official_name) || 
    empty($data->ward_no) || 
    empty($data->official_address) ||
    empty($data->contact_tel) ||
    empty($data->contact_mail) ||
    empty($data->admin_phone) ||
    empty($data->password)) {
    
    $missing_fields = [];
    if (empty($data->ward_official_name)) $missing_fields[] = "ward_official_name";
    if (empty($data->ward_no)) $missing_fields[] = "ward_no";
    if (empty($data->official_address)) $missing_fields[] = "official_address";
    if (empty($data->contact_tel)) $missing_fields[] = "contact_tel";
    if (empty($data->contact_mail)) $missing_fields[] = "contact_mail";
    if (empty($data->admin_phone)) $missing_fields[] = "admin_phone";
    if (empty($data->password)) $missing_fields[] = "password";
    
    http_response_code(400);
    echo json_encode([
        "message" => "Incomplete data",
        "missing_fields" => $missing_fields
    ]);
    exit();
}

try {
    // Check if ward number or admin phone already exists
    $check_query = "SELECT id FROM wards WHERE ward_no = :ward_no OR admin_phone = :admin_phone";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':ward_no', $data->ward_no);
    $check_stmt->bindParam(':admin_phone', $data->admin_phone);
    $check_stmt->execute();
    
    if($check_stmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(["message" => "Ward number or admin phone already exists."]);
        exit();
    }

    // Hash password
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    $query = "INSERT INTO wards 
              (ward_official_name, ward_no, official_address, contact_tel, contact_mail, admin_phone, password_hash) 
              VALUES 
              (:ward_official_name, :ward_no, :official_address, :contact_tel, :contact_mail, :admin_phone, :password_hash)";

    $stmt = $db->prepare($query);

    $stmt->bindParam(':ward_official_name', $data->ward_official_name);
    $stmt->bindParam(':ward_no', $data->ward_no);
    $stmt->bindParam(':official_address', $data->official_address);
    $stmt->bindParam(':contact_tel', $data->contact_tel);
    $stmt->bindParam(':contact_mail', $data->contact_mail);
    $stmt->bindParam(':admin_phone', $data->admin_phone);
    $stmt->bindParam(':password_hash', $password_hash);

    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Ward registration successful. Waiting for approval."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to register ward."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>