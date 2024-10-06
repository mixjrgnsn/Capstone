<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
require "DataBase.php";
$db = new DataBase();

$response = array();

if (isset($_POST['id']) && isset($_POST['firstname']) && isset($_POST['lastname']) && isset($_POST['email']) && isset($_POST['password']) && isset($_POST['address'])) {
    if ($db->dbConnect()) {
        if ($db->accArchive("accarchive", $_POST['id'], $_POST['firstname'], $_POST['lastname'], $_POST['email'], $_POST['password'], $_POST['address'])) {
            $response['status'] = 'success';
            $response['message'] = 'Removed Successfully';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Remove Failed';
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
