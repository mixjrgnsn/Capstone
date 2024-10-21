<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
require "DataBase.php";
$db = new DataBase();
if (isset($_POST['firstname']) && isset($_POST['lastname']) && isset($_POST['email']) && isset($_POST['password']) && isset($_POST['address'])) {
    if ($db->dbConnect()) {
        $signUpResult = $db->signUp("accapproval", $_POST['firstname'], $_POST['lastname'], $_POST['email'], $_POST['password'], $_POST['address']);
        if ($signUpResult === true) {
            echo "Your account is waiting to approve";
        } else {
            echo $signUpResult;
        }
    } else {
        echo "Error: Database connection";
    }    
} else echo "All fields are required";
?>