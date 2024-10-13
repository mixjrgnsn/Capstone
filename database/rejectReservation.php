<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php"; // Ensure the path to DataBase.php is correct

$db = new DataBase();

if ($db->dbConnect()) { // Check if the database connection is successful

    // Get the ID from the request
    parse_str(file_get_contents("php://input"), $_DELETE);
    $id = $_DELETE['id'] ?? null; // Use null coalescing to avoid undefined index notice

    if ($id) {
        // Log the ID received
        error_log("Received ID for deletion: " . $id);

        // Call the method to delete a reservation
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
