<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";

$db = new DataBase();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['id'])) {
    $id = $_GET['id']; // Get the ID from the query parameter

    if ($db->dbConnect()) {
        if ($db->updateStatusToCompleted($id)) {
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