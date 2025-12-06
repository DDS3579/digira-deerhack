<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");require_once '../../config/database.php';


header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: 0");
$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if(!empty($data->user_id)) {
    
    $query = "SELECT u.first_name, u.last_name, u.house_no, u.phone, u.profession, 
                     w.ward_no, t.tole_name
              FROM users u
              JOIN wards w ON u.ward_id = w.id
              JOIN toles t ON u.tole_id = t.id
              WHERE u.id = :user_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->execute();

    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $profile = array(
            "first_name" => $row['first_name'],
            "last_name" => $row['last_name'],
            "full_name" => $row['first_name'] . ' ' . $row['last_name'],
            "house_no" => $row['house_no'],
            "phone" => $row['phone'],
            "profession" => $row['profession'],
            "ward_no" => $row['ward_no'],
            "tole_name" => $row['tole_name']
        );
        
        http_response_code(200);
        echo json_encode($profile);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "User not found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "User ID required."));
}
?>