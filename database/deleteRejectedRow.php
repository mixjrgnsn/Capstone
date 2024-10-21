<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header('Content-Type: application/json');

require 'DataBase.php';

$db = new DataBase();
$db->dbConnect();

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

error_log("Received ID: " . print_r($id, true));

if ($id) {
    $table = 'accapproval';
    $success = $db->deleteArchiveRow($table, $id);

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Rejected successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to reject.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No ID provided.']);
}

?>
