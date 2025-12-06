<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


if(!empty($data->ward_id) && !empty($data->tole_name)) {
    

    $check_query = "SELECT id FROM toles WHERE ward_id = :ward_id AND tole_name = :tole_name";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':ward_id', $data->ward_id);
    $check_stmt->bindParam(':tole_name', $data->tole_name);
    $check_stmt->execute();
    
    if($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Tole already exists in this ward."));
        exit();
    }

    $query = "INSERT INTO toles (ward_id, tole_name) VALUES (:ward_id, :tole_name)";
    $stmt = $db->prepare($query);

    $stmt->bindParam(':ward_id', $data->ward_id);
    $stmt->bindParam(':tole_name', $data->tole_name);

    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Tole added successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add tole."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data."));
}
?>