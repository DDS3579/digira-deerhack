<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$query = "SELECT id, ward_no, ward_official_name FROM wards WHERE status = 'approved' ORDER BY ward_no";
$stmt = $db->prepare($query);
$stmt->execute();

$wards = array();
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $wards[] = $row;
}

http_response_code(200);
echo json_encode($wards);
?>