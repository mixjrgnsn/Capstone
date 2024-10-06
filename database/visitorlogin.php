<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";
$db = new DataBase();
if (isset($_POST['firstname']) && isset($_POST['lastname']) && isset($_POST['purpose']) && isset($_POST['timein']) && isset($_POST['date'])) {
    if ($db->dbConnect()) {
        if ($db->visitorlogin($_POST['firstname'], $_POST['lastname'], $_POST['purpose'], $_POST['timein'], $_POST['date'])) {
            echo "Record has been saved successfully!";
        } else {
            echo "Submission failed";
        }
    } else {
        echo "Error: Database connection";
    }
} else {
    echo "All fields are required";
}
?>