<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require 'DataBase.php';

$db = new DataBase();

$db->dbConnect();

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['content'])) {
    $content = $data['content'];

    if ($db->deleteAnnouncementByContent($content)) {
        echo json_encode(['success' => true, 'message' => 'Announcement deleted successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete announcement.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No content provided.']);
}
?>