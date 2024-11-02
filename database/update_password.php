<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require "DataBase.php";
$db = new DataBase();

if ($db->dbConnect()) {
    $email = isset($_POST['email']) ? mysqli_real_escape_string($db->connect, $_POST['email']) : '';
    $newPass = isset($_POST['newPass']) ? mysqli_real_escape_string($db->connect, $_POST['newPass']) : '';

    // Hash the new password
    $hashedNewPass = password_hash($newPass, PASSWORD_DEFAULT);
    $updateSql = "UPDATE users SET password = '$hashedNewPass' WHERE email = '$email'";

    if (mysqli_query($db->connect, $updateSql)) {
        echo json_encode(array("status" => "success", "message" => "Password updated successfully"));
    } else {
        echo json_encode(array("status" => "error", "message" => "Error updating password"));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Database connection failed"));
}
?>