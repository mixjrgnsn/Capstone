<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";
$db = new DataBase();

if ($db->dbConnect()) {
    $content = isset($_POST['content']) ? $_POST['content'] : null;
    $imageFile = isset($_FILES['image']) ? $_FILES['image'] : null;

    if ($content) {
        // Handle the image upload
        $imagePath = null;
        if ($imageFile && $imageFile['error'] == UPLOAD_ERR_OK) {
            $uploadDir = '../uploads/'; // Specify your upload directory
            $imagePath = $uploadDir . basename($imageFile['name']);
            $image_name = basename($imageFile['name']);
            // Move the uploaded file to the specified directory
            if (!move_uploaded_file($imageFile['tmp_name'], $imagePath)) {
                echo "Image upload failed.";
                exit;
            }
        }
        // Call the announcement function with content and image path
        if ($db->announcement($content, $image_name)) {
            echo "Announcement posted successfully.";
        } else {
            echo "Announcement submission failed.";
        }
    } else {
        echo "Content is required.";
    }
} else {
    echo "Error: Database connection.";
}
?>