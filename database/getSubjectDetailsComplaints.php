<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require 'Database.php';

$db = new DataBase();
$db->dbConnect();

$id = isset($_GET['id']) ? $_GET['id'] : '';

if (!$id) {
    echo json_encode([]);
    exit();
}

$table = 'complaints';  // Replace with your actual table name

// Fetch data from the table using the new method
$data = $db->getSubjectDetails($table, $id);

// Output the data in JSON format
echo json_encode($data);
?>
