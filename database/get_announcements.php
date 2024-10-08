<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require "DataBase.php";
$db = new DataBase();

if ($db->dbConnect()) {
    $sql = "SELECT * FROM announcements ORDER BY id DESC";
    $result = mysqli_query($db->connect, $sql);
    
    $announcements = array();
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $announcements[] = $row;
        }
        echo json_encode($announcements);
    } else {
        echo json_encode(array("message" => "No announcements found."));
    }
} else {
    echo json_encode(array("message" => "Error: Database connection"));
}
?>