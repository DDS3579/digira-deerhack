<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}


$api_info = [
    'app_name' => 'Tolemitra',
    'version' => '1.0.0',
    'description' => 'API for Tolemitra - Community Management System',
    'endpoints' => [
        'auth' => [
            'POST /api/auth/register.php' => 'Register a new user',
            'POST /api/auth/ward_register.php' => 'Register a ward admin',
            'POST /api/auth/login.php' => 'Login for both users and ward admins'
        ],
        'ward' => [
            'POST /api/ward/add_tole.php' => 'Add a new tole (ward admin only)',
            'GET /api/ward/get_wards.php' => 'Get all approved wards'
        ],
        'user' => [
            'POST /api/user/profile.php' => 'Get user profile'
        ]
    ],
    'status' => 'API is running',
    'timestamp' => date('Y-m-d H:i:s')
];


if ($_SERVER['REQUEST_URI'] == '/' || $_SERVER['REQUEST_URI'] == '/backend/' || $_SERVER['REQUEST_URI'] == '/backend/index.php') {
    http_response_code(200);
    echo json_encode($api_info);
    exit();
}


http_response_code(404);
echo json_encode([
    'error' => 'Endpoint not found',
    'message' => 'The requested API endpoint does not exist.',
    'available_endpoints' => $api_info['endpoints'],
    'suggested_url' => 'Check the API documentation above for available endpoints'
]);
?>