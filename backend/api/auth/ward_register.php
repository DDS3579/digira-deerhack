<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if(!empty($data->ward_official_name) && 
   !empty($data->ward_no) && 
   !empty($data->official_address) &&
   !empty($data->contact_tel) &&
   !empty($data->contact_mail) &&
   !empty($data->admin_phone) &&
   !empty($data->password)) {


    $check_query = "SELECT id FROM wards WHERE ward_no = :ward_no OR admin_phone = :admin_phone";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':ward_no', $data->ward_no);
    $check_stmt->bindParam(':admin_phone', $data->admin_phone);
    $check_stmt->execute();
    
    if($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Ward number or phone already exists."));
        exit();
    }

    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    $query = "INSERT INTO wards 
              (ward_official_name, ward_no, official_address, contact_tel, contact_mail, legal_document_path, admin_phone, password_hash) 
              VALUES 
              (:ward_official_name, :ward_no, :official_address, :contact_tel, :contact_mail, :legal_document_path, :admin_phone, :password_hash)";

    $stmt = $db->prepare($query);

    $legal_document_path = null;
    if(isset($data->legal_document) && !empty($data->legal_document)) {
        // In a real , store the file and store the path
        $legal_document_path = "uploads/legal_docs/" . basename($data->legal_document);
    }

    $stmt->bindParam(':ward_official_name', $data->ward_official_name);
    $stmt->bindParam(':ward_no', $data->ward_no);
    $stmt->bindParam(':official_address', $data->official_address);
    $stmt->bindParam(':contact_tel', $data->contact_tel);
    $stmt->bindParam(':contact_mail', $data->contact_mail);
    $stmt->bindParam(':legal_document_path', $legal_document_path);
    $stmt->bindParam(':admin_phone', $data->admin_phone);
    $stmt->bindParam(':password_hash', $password_hash);

    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Ward registration successful. Waiting for approval."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to register ward."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data."));
}
?>