<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require "DataBase.php";
$db = new DataBase();

if (isset($_POST['content'])) {
    if ($db->dbConnect()) {
        if ($db->announcement($_POST['content'])) {
            echo "Announcement Submitted";
            
            // Send FCM Notification
            $fcmUrl = 'https://fcm.googleapis.com/fcm/send';
            $serverKey = 'BBIMn5tAUqpeZ7wM1Xt0v3liN4LnzRBh6bPINlsxu4v8yDqBm-bUhoA-EPeseWm8vC9-TFMnjX1ditu3H0BT9TE';  // Replace with your server key from Firebase

            $notification = [
                'title' => 'New Announcement',
                'body' => $_POST['content'],
                'sound' => 'default'
            ];

            $fcmNotification = [
                'to' => '/topics/announcements', // You can use a specific token here instead of topics
                'notification' => $notification
            ];

            $headers = [
                'Authorization: key=' . $serverKey,
                'Content-Type: application/json'
            ];

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $fcmUrl);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fcmNotification));
            $result = curl_exec($ch);
            curl_close($ch);

        } else {
            echo "Announcement Submission Failed";
        }
    } else {
        echo "Error: Database connection";
    }
} else {
    echo "All fields are required";
}
?>
