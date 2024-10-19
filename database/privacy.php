<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require "DataBase.php";
$db = new DataBase();

if ($db->dbConnect()) {
    // Get the POST data
    $email = isset($_POST['email']) ? mysqli_real_escape_string($db->connect, $_POST['email']) : '';
    $oldPass = isset($_POST['oldPass']) ? mysqli_real_escape_string($db->connect, $_POST['oldPass']) : '';
    $newPass = isset($_POST['newPass']) ? mysqli_real_escape_string($db->connect, $_POST['newPass']) : '';

    if (!empty($email) && !empty($oldPass) && !empty($newPass)) {
        // Fetch the user by email
        $sql = "SELECT password FROM users WHERE email = '$email'";
        $result = mysqli_query($db->connect, $sql);

        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $storedHashedPassword = $row['password'];

            // Verify the old password
            if (password_verify($oldPass, $storedHashedPassword)) {
                // Old password matches, proceed to update the password
                $newPassHashed = password_hash($newPass, PASSWORD_DEFAULT);
                $updateSql = "UPDATE users SET password = '$newPassHashed' WHERE email = '$email'";

                if (mysqli_query($db->connect, $updateSql)) {
                    echo json_encode(array("status" => "success", "message" => "Password updated successfully"));
                } else {
                    echo json_encode(array("status" => "error", "message" => "Failed to update password"));
                }
            } else {
                echo json_encode(array("status" => "error", "message" => "Incorrect old password"));
            }
        } else {
            echo json_encode(array("status" => "error", "message" => "User not found"));
        }
    } else {
        echo json_encode(array("status" => "error", "message" => "Missing required fields"));
    }
} else {
    echo json_encode(array("message" => "Error: Database connection"));
}
?>
