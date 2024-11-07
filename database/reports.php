<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";
$db = new DataBase();

if ($db->dbConnect()) {
    $name = isset($_POST['name']) ? $_POST['name'] : null;
    $date = isset($_POST['date']) ? $_POST['date'] : null;
    $subject = isset($_POST['subject']) ? $_POST['subject'] : null;
    $imageFile = isset($_FILES['image']) ? $_FILES['image'] : null;

    if ($name && $date && $subject) {
        $image_name = null;

        if ($imageFile && $imageFile['error'] == UPLOAD_ERR_OK) {
            $uploadDir = '../uploads/';
            $image_name = basename($imageFile['name']);
            $imagePath = $uploadDir . $image_name;

            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!in_array($imageFile['type'], $allowedTypes)) {
                echo "Only image files (JPEG, PNG, GIF) are allowed.";
                exit;
            }

            if (!move_uploaded_file($imageFile['tmp_name'], $imagePath)) {
                echo "Image upload failed.";
                exit;
            }
        }

        if ($db->reports($name, $date, $subject, $image_name)) {
            echo "Report Submitted";
        } else {
            echo "Report Submission Failed";
        }
    } else {
        echo "All fields are required";
    }
} else {
    echo "Error: Database connection";
}
?>