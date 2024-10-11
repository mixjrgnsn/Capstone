<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require 'Database.php';

// Create a new instance of the DataBase class
$db = new DataBase();

// Connect to the database
$db->dbConnect();

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);

// Check if the content is provided
if (isset($data['content'])) {
    $content = $data['content']; // Get the content to delete

    // Call a method to delete the announcement
    if ($db->deleteAnnouncementByContent($content)) {
        echo json_encode(['success' => true, 'message' => 'Announcement deleted successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete announcement.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No content provided.']);
}
?>