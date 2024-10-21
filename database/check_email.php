<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";
$db = new DataBase();

if ($db->dbConnect()) {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $db->connect->real_escape_string($data['email']);

    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = mysqli_query($db->connect, $sql);

    if ($result && mysqli_num_rows($result) > 0) {
        echo json_encode(['message' => 'Email is registered.']);
    } else {
        echo json_encode(['message' => 'Email is not registered.']);
    }
} else {
    echo json_encode(['message' => 'Error: Database connection']);
}
?>
