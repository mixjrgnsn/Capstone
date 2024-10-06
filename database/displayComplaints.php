<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require 'Database.php';

// Create a new instance of the DataBase class
$db = new DataBase();

// Connect to the database
$db->dbConnect();

// Specify the table you want to display
$table = 'complaints';  // Replace with your actual table name

// Fetch data from the table
$data = $db->displayComplaints($table);

// Output the data in JSON format
echo json_encode($data);
?>