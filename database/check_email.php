<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";
$db = new DataBase();

if ($db->dbConnect()) {
    // Get the JSON input
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $db->connect->real_escape_string($data['email']); // Use the connection for escaping

    // Prepare and execute the query
    $sql = "SELECT * FROM users WHERE email='$email'"; // Assuming your table name is 'users'
    $result = mysqli_query($db->connect, $sql);

    // Check if the email exists
    if ($result && mysqli_num_rows($result) > 0) {
        echo json_encode(['message' => 'Email is registered.']);
    } else {
        echo json_encode(['message' => 'Email is not registered.']);
    }
} else {
    echo json_encode(['message' => 'Error: Database connection']);
}
?>
