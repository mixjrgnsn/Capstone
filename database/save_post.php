<?php
require 'DataBase.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $db = new DataBase();
    if ($db->dbConnect()) {
        $text = $_POST['text'];
        $image = $_FILES['image'];

        // Call the function to save the post
        if ($db->savePost($text, $image)) {
            echo "Post uploaded successfully!";
        } else {
            echo "Failed to upload post.";
        }
    } else {
        echo "Database connection failed.";
    }
}
?>
