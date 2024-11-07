<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";
$db = new DataBase();

if ($db->dbConnect()) {
    // Get complaint data
    $name = isset($_POST['name']) ? $_POST['name'] : null;
    $date = isset($_POST['date']) ? $_POST['date'] : null;
    $subject = isset($_POST['subject']) ? $_POST['subject'] : null;
    $imageFile = isset($_FILES['image']) ? $_FILES['image'] : null;

    if ($name && $date && $subject) {
        // Initialize image name to null
        $image_name = null;

        // Handle the image upload
        if ($imageFile && $imageFile['error'] == UPLOAD_ERR_OK) {
            $uploadDir = '../uploads/'; // Directory where images will be stored
            $image_name = basename($imageFile['name']);
            $imagePath = $uploadDir . $image_name;

            // Check file type (only allow image types)
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!in_array($imageFile['type'], $allowedTypes)) {
                echo "Only image files (JPEG, PNG, GIF) are allowed.";
                exit;
            }

            // Move the uploaded file to the specified directory
            if (!move_uploaded_file($imageFile['tmp_name'], $imagePath)) {
                echo "Image upload failed.";
                exit;
            }
        }

        // Call the complaints function with complaint data and image name
        if ($db->complaints($name, $date, $subject, $image_name)) {
            echo "Complaint Submitted"; // Success message
        } else {
            echo "Complaint Submission Failed"; // Failure message
        }
    } else {
        echo "All fields are required"; // Missing input fields
    }
} else {
    echo "Error: Database connection"; // Database connection failure
}
?>
