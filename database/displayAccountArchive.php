<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require 'DataBase.php';

$db = new DataBase();

$db->dbConnect();

$table = 'accarchive';

$data = $db->displayAccountArchive($table);

echo json_encode($data);
?>
