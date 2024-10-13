<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";
$db = new DataBase();

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['id']) && isset($_POST['name']) && isset($_POST['date']) && isset($_POST['timeFrom']) && isset($_POST['timeTo']) && isset($_POST['purpose'])) {
        if ($db->dbConnect()) {
            if ($db->acceptReservation("reservedlist", $_POST['id'], $_POST['name'], $_POST['date'], $_POST['timeFrom'], $_POST['timeTo'], $_POST['purpose'])) {
                $response['status'] = 'success';
                $response['message'] = 'Reservation Accepted Successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Reservation Acceptance Failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Database connection error';
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'All fields are required';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid request method';
}

echo json_encode($response);
?>
