<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS"); // Allow DELETE method
header('Content-Type: application/json');

require 'Database.php';

// Create a new instance of the DataBase class
$db = new DataBase();
$db->dbConnect();

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null; // Get the ID from the decoded JSON

// Debugging line to log the received ID
error_log("Received ID: " . print_r($id, true)); // Log the ID for debugging

if ($id) {
    $table = 'accapproval';  // Your table name
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
