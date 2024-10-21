<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";

$db = new DataBase();

if ($db->dbConnect()) {

    parse_str(file_get_contents("php://input"), $_DELETE);
    $id = $_DELETE['id'] ?? null;

    if ($id) {
        error_log("Received ID for deletion: " . $id);

        if ($db->rejectReservation($id)) {
            echo json_encode(["success" => true, "message" => "Reservation rejected successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "No reservation found with the provided ID."]);
        }
    } else {
        error_log("ID parameter is missing.");
        echo json_encode(["success" => false, "message" => "ID parameter is missing."]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Error: Database connection"]);
}
?>
