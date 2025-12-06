<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if(!empty($data->first_name) && 
   !empty($data->last_name) && 
   !empty($data->house_no) &&
   !empty($data->phone) &&
   !empty($data->profession) &&
   !empty($data->ward_id) &&
   !empty($data->tole_name) &&
   !empty($data->password)) {

   
    $check_query = "SELECT id FROM users WHERE phone = :phone";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':phone', $data->phone);
    $check_stmt->execute();
    
    if($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Phone number already registered."));
        exit();
    }


    $ward_query = "SELECT id FROM wards WHERE id = :ward_id AND status = 'approved'";
    $ward_stmt = $db->prepare($ward_query);
    $ward_stmt->bindParam(':ward_id', $data->ward_id);
    $ward_stmt->execute();
    
    if($ward_stmt->rowCount() == 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Ward not found or not approved."));
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
        $insert_stmt->execute();
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
        echo json_encode(array("message" => "User registered successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to register user."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data."));
}
?>