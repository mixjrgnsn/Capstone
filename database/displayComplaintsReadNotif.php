<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require "DataBase.php";
$db = new DataBase();

if ($db->dbConnect()) {
    $name = isset($_GET['name']) ? mysqli_real_escape_string($db->connect, $_GET['name']) : '';

    $sql = "SELECT * FROM complaints 
            WHERE (status = 'ON GOING' OR status = 'COMPLETED') AND name = '$name' ORDER BY updated_at DESC";

    $result = mysqli_query($db->connect, $sql);
    
    $complaints = array();
    if ($result && mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $row['updated_at'] = date("Y-m-d h:i A", strtotime($row['updated_at']));
            $complaints[] = $row;
        }
        echo json_encode($complaints);
    } else {
        echo json_encode(array("message" => "No complaint found."));
    }
} else {
    echo json_encode(array("message" => "Error: Database connection"));
}
?>