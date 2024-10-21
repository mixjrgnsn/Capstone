<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
require "DataBase.php";
$db = new DataBase();

$response = array();

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['firstname']) && isset($data['lastname']) && isset($data['timeout'])) {
    if ($db->dbConnect()) {
        $firstname = $data['firstname'];
        $lastname = $data['lastname'];
        $timeout = $data['timeout'];

        if ($db->storeTimeout($firstname, $lastname, $timeout)) {
            $response['status'] = 'success';
            $response['message'] = 'Timeout updated successfully';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Failed to update timeout';
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
