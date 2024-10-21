<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";
$db = new DataBase();

if ($db->dbConnect()) {
    $input = json_decode(file_get_contents("php://input"), true);
    $firstName = $input['firstname'] ?? '';
    $lastName = $input['lastname'] ?? '';

    $sql = "SELECT * FROM complaints WHERE firstname = ? AND lastname = ? AND status = 'READ'";
    $stmt = $db->connect->prepare($sql);
    $stmt->bind_param("ss", $firstName, $lastName);
    $stmt->execute();
    
    $result = $stmt->get_result();
    
    $items = array();
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $items[] = $row;
        }
        echo json_encode($items);
    } else {
        echo json_encode(array("message" => "No items found."));
    }

    $stmt->close();
} else {
    echo json_encode(array("message" => "Error: Database connection"));
}
?>