<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require 'DataBase.php';

$db = new DataBase();
$db->dbConnect();

$id = isset($_GET['id']) ? $_GET['id'] : '';

if (!$id) {
    echo json_encode([]);
    exit();
}

$table = 'complaints';

$data = $db->getSubjectDetails($table, $id);

echo json_encode($data);
?>
