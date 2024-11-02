<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";
$db = new DataBase();
if (isset($_POST['name']) && isset($_POST['date']) && isset($_POST['timeFrom']) && isset($_POST['am_pm_from']) && isset($_POST['timeTo']) && isset($_POST['am_pm_to']) && isset($_POST['purpose'])) {
        if ($db->dbConnect()) {
        $reservationResult = $db->reservations($_POST['name'], $_POST['date'], $_POST['timeFrom'], $_POST['am_pm_from'], $_POST['timeTo'], $_POST['am_pm_to'], $_POST['purpose']);
        
        if ($reservationResult === true) {
            echo "Reservation Submitted";
        } else {
            echo $reservationResult;
        }   
    } else {
        echo "Error: Database connection";
    }

} else {
    echo "All fields are required";
}
?>