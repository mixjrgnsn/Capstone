<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";
$db = new DataBase();

if (isset($_POST['email']) && isset($_POST['password'])) {
    if ($db->dbConnect()) {
        $loginResult = $db->loginWeb("registration", $_POST['email'], $_POST['password']);
        echo $loginResult;
    } else {
        echo "Error: Database connection";
    }
} else {
    echo "All fields are required";
}
?>