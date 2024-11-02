<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";

$db = new DataBase();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['id'])) {
    $id = $_GET['id'];

    if ($db->dbConnect()) {
        if ($db->update_status($id)) {
            echo "Marked as COMPLETED successfully";
        } else {
            echo "Failed to mark as COMPLETED";
        }
    } else {
        echo "Error: Database connection";
    }
} else {
    echo "Invalid request";
}
?>