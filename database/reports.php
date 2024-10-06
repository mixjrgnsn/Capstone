<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";
$db = new DataBase();
if (isset($_POST['name']) && isset($_POST['date']) && isset($_POST['subject'])) {
    if ($db->dbConnect()) {
        if ($db->reports($_POST['name'], $_POST['date'], $_POST['subject'])) {
            echo "Report Submitted";
        } else {
            echo "Report Submission Failed";
        }
    } else {
        echo "Error: Database connection";
    }
} else {
    echo "All fields are required";
}
?>