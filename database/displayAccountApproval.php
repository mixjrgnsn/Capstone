<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require 'DataBase.php';

$db = new DataBase();

$db->dbConnect();

$table = 'accapproval';

$data = $db->displayAccountApproval($table);

echo json_encode($data);
?>
