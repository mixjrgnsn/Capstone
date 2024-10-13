<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require "DataBase.php";
$db = new DataBase();

if ($db->dbConnect()) {
    $name = isset($_GET['name']) ? mysqli_real_escape_string($db->connect, $_GET['name']) : '';

    // SQL query to fetch reports with status 'READ', ordered by a specific column (e.g., created_at) in descending order
    $sql = "SELECT * FROM reports WHERE status = 'READ' AND name = '$name' ORDER BY id DESC";
    $result = mysqli_query($db->connect, $sql);
    
    $reports = array();
    if ($result && mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $reports[] = $row;
        }
        echo json_encode($reports);
    } else {
        echo json_encode(array("message" => "No report found."));
    }
} else {
    echo json_encode(array("message" => "Error: Database connection"));
}
?>
