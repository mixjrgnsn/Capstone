<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
require "DataBase.php";
$db = new DataBase();

$response = array();

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['timeout']) && isset($data['id'])) { // Change TAG to ID
    if ($db->dbConnect()) {
        $timeout = $data['timeout'];
        $id = $data['id']; // Change TAG to ID

        if ($db->updateLogbookTimeout($id, $timeout)) { // Change TAG to ID
            $response['status'] = 'success';
            $response['message'] = 'Entry added successfully';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Failed to add entry';
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Database connection error';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'All fields are required';
}

echo json_encode($response);
?>
