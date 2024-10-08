<?php
require "DataBaseConfig.php";

class DataBase
{
    public $connect;
    public $data;
    private $sql;
    protected $servername;
    protected $email;
    protected $password;
    protected $databasename;

    public function __construct()
    {
        $this->connect = null;
        $this->data = null;
        $this->sql = null;
        $dbc = new DataBaseConfig();
        $this->servername = $dbc->servername;
        $this->email = $dbc->email;
        $this->password = $dbc->password;
        $this->databasename = $dbc->databasename;
    }

    function dbConnect()
    {
        $this->connect = mysqli_connect($this->servername, $this->email, $this->password, $this->databasename);
        return $this->connect;
    }

    function prepareData($data)
    {
        return mysqli_real_escape_string($this->connect, stripslashes(htmlspecialchars($data)));
    }

    function logIn($table, $email, $password)
    {
        $email = $this->prepareData($email);
        $this->sql = "SELECT * FROM " . $table . " WHERE email = '" . $email . "'";
        $result = mysqli_query($this->connect, $this->sql);
        $row = mysqli_fetch_assoc($result);

        if (mysqli_num_rows($result) != 0) {
            $dbemail = $row['email'];
            $dbpassword = $row['password'];

            // Verify the hashed password
            if ($dbemail == $email && password_verify($password, $dbpassword)) {
                return json_encode(array(
                    "id" => $row['id'],
                    "firstname" => $row['firstname'],
                    "lastname" => $row['lastname'],
                    "address" => $row['address']
                ));
            } else return false;
        } else return false;
    }

    function signUp($table, $firstname, $lastname, $email, $password, $address)
    {
        $firstname = $this->prepareData($firstname);
        $lastname = $this->prepareData($lastname);
        $email = $this->prepareData($email);
        
        // Hash the password before storing it
        $hashedPassword = password_hash($this->prepareData($password), PASSWORD_DEFAULT);
        $address = $this->prepareData($address);

        $this->sql =
            "INSERT INTO " . $table . " (firstname, lastname, email, password, address) VALUES ('" . $firstname . "','" . $lastname . "','" . $email . "','" . $hashedPassword . "','" . $address . "')";
        if (mysqli_query($this->connect, $this->sql)) {
            return true;
        } else return false;
    }

    function complaints($name, $date, $subject)
    {
        $name = $this->prepareData($name);
        $date = $this->prepareData($date);
        $subject = $this->prepareData($subject);
        $this->sql = "INSERT INTO complaints (name, date, subject) VALUES ('$name', '$date', '$subject')";
        if (mysqli_query($this->connect, $this->sql)) {
            return true;
        } else {
            return false;
        }
    }

    function reservations($name, $date, $timeFrom, $am_pm_from, $timeTo, $am_pm_to, $purpose)
    {
        $name = $this->prepareData($name);
        $date = $this->prepareData($date);
        $timeFrom = $this->prepareData($timeFrom);
        $timeTo = $this->prepareData($timeTo);
        $am_pm_from = $this->prepareData($am_pm_from);
        $am_pm_to = $this->prepareData($am_pm_to);
        $purpose = $this->prepareData($purpose);
        $this->sql = "INSERT INTO reservations (name, date, timeFrom, am_pm_from, timeTo, am_pm_to, purpose) VALUES ('$name', '$date', '$timeFrom', '$am_pm_from', '$timeTo', '$am_pm_to', '$purpose')";
        if (mysqli_query($this->connect, $this->sql)) {
            return true;
        } else {
            return false;
        }
    }

    function reports($name, $date, $subject)
    {
        $name = $this->prepareData($name);
        $date = $this->prepareData($date);
        $subject = $this->prepareData($subject);
        $this->sql = "INSERT INTO reports (name, date, subject) VALUES ('$name', '$date', '$subject')";
        if (mysqli_query($this->connect, $this->sql)) {
            return true;
        } else {
            return false;
        }
    }

    function displayUsers($table)
    {
        $columns = 'id AS ID, firstname AS FIRSTNAME, lastname AS LASTNAME, email AS EMAIL, password AS PASSWORD, address AS ADDRESS';

        $this->sql = "SELECT $columns FROM " . $table . " ORDER BY id DESC";
        $result = mysqli_query($this->connect, $this->sql);
        
        if ($result) {
            $data = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = $row;
            }
            return $data;
        } else {
            return false;
        }
    }

    function displayReservations($table)
    {
        $columns = 'name AS NAME, date AS DATE, CONCAT(timeFrom, " ", am_pm_from) AS `TIME FROM`, CONCAT(timeTo, " ", am_pm_to) AS `TIME TO`, purpose AS PURPOSE';
        
        $this->sql = "SELECT $columns FROM " . $table;
        $result = mysqli_query($this->connect, $this->sql);
        
        if ($result) {
            $data = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = $row;
            }
            return $data;
        } else {
            return false;
        }
    }

    function displayComplaints($table)
    {
        $columns = 'id AS TAG, name AS NAME, date AS DATE';
        
        $this->sql = "SELECT $columns FROM " . $table;
        $result = mysqli_query($this->connect, $this->sql);
        
        if ($result) {
            $data = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = $row;
            }
            return $data;
        } else {
            return false;
        }
    }

    function displayReports($table)
    {
        $columns = 'id AS TAG, name AS NAME, date AS DATE';
        
        $this->sql = "SELECT $columns FROM " . $table;
        $result = mysqli_query($this->connect, $this->sql);
        
        if ($result) {
            $data = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = $row;
            }
            return $data;
        } else {
            return false;
        }
    }

    function displayAccountApproval($table)
    {
        $columns = 'id AS ID, firstname AS FIRSTNAME, lastname AS LASTNAME, email AS EMAIL, password AS PASSWORD, address AS ADDRESS';
        
        $this->sql = "SELECT $columns FROM " . $table . " ORDER BY id DESC";
        $result = mysqli_query($this->connect, $this->sql);
        
        if ($result) {
            $data = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = $row;
            }
            return $data;
        } else {
            return false;
        }
    }

    function adminlogin($table, $username, $password)
    {
        $username = $this->prepareData($username);
        $password = $this->prepareData($password);
        $this->sql = "select * from " . $table . " where username = '" . $username . "'";
        $result = mysqli_query($this->connect, $this->sql);
        $row = mysqli_fetch_assoc($result);
        if (mysqli_num_rows($result) != 0) {
            $dbusername = $row['username'];
            $dbpassword = $row['password'];
            if ($dbusername == $username && $dbpassword == $password) {
                $login = true;
            } else $login = false;
        } else $login = false;

        return $login;
    }

    function securitylogin($table, $username, $password)
    {
        $username = $this->prepareData($username);
        $password = $this->prepareData($password);
        $this->sql = "select * from " . $table . " where username = '" . $username . "'";
        $result = mysqli_query($this->connect, $this->sql);
        $row = mysqli_fetch_assoc($result);
        if (mysqli_num_rows($result) != 0) {
            $dbusername = $row['username'];
            $dbpassword = $row['password'];
            if ($dbusername == $username && $dbpassword == $password) {
                $login = true;
            } else $login = false;
        } else $login = false;

        return $login;
    }

    function visitorLogin($firstname, $lastname, $purpose, $timein, $date)
    {
        $firstname = $this->prepareData($firstname);
        $lastname = $this->prepareData($lastname);
        $purpose = $this->prepareData($purpose);
        $timein = $this->prepareData($timein);
        $date = $this->prepareData($date);
        $this->sql = "INSERT INTO visitorlogin (firstname, lastname, purpose, timein, date) VALUES ('$firstname', '$lastname', '$purpose', '$timein', '$date')";
        if (mysqli_query($this->connect, $this->sql)) {
            return true;
        } else {
            return false;
        }
    }

    function displayVisitorRecord($table)
    {
        $columns = 'firstname AS FIRSTNAME, lastname AS LASTNAME, date AS DATE, timein AS `TIME IN`, purpose AS PURPOSE';
        
        $this->sql = "SELECT $columns FROM " . $table;
        $result = mysqli_query($this->connect, $this->sql);
        
        if ($result) {
            $data = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = $row;
            }
            return $data;
        } else {
            return false;
        }
    }

    function approveSignup($table, $id, $firstname, $lastname, $email, $password, $address)
    {
        $id = $this->prepareData($id); 
        $firstname = $this->prepareData($firstname);
        $lastname = $this->prepareData($lastname);
        $email = $this->prepareData($email);
        $password = $this->prepareData($password);
        $address = $this->prepareData($address);

        // Insert the data into the users table
        $this->sql =
            "INSERT INTO " . $table . " (id, firstname, lastname, email, password, address) VALUES ('" . $id . "','" . $firstname . "','" . $lastname . "','" . $email . "','" . $password . "','" . $address . "')";
        if (mysqli_query($this->connect, $this->sql)) {
            // If insert was successful, delete the row from the pending table
            return $this->deletePendingRow($id);
        } else {
            return false;
        }
    }

    function deletePendingRow($id)
    {
        $id = $this->prepareData($id);

        // Assume there's a 'pending_users' table where the new signups are stored
        $this->sql = "DELETE FROM accapproval WHERE id = '" . $id . "'";
        return mysqli_query($this->connect, $this->sql);
    }

    function getSubjectDetails($table, $id) {
        $sql = "SELECT id AS ID, name AS NAME, date AS DATE, subject AS SUBJECT FROM " . $table . " WHERE id = ?";
        $stmt = $this->connect->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
    
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        return $data;
    }

    function loginWeb($table, $email, $password)
    {
        $email = $this->prepareData($email);
        $this->sql = "SELECT * FROM " . $table . " WHERE email = '" . $email . "'";
        $result = mysqli_query($this->connect, $this->sql);
        $row = mysqli_fetch_assoc($result);

        if (mysqli_num_rows($result) != 0) {
            $dbemail = $row['email'];
            $dbpassword = $row['password'];
            
            if ($dbemail == $email && password_verify($password, $dbpassword)) {
                return "Login successful";
            } else {
                return "Email or Password wrong";
            }
        } else {
            return "No user found with this email";
        }
    }


    function displayLogbook($table)
    {
        $columns = 'firstname AS FIRSTNAME, lastname AS LASTNAME, date AS DATE, timein AS `TIME IN`, timeout AS `TIME OUT`, purpose AS PURPOSE';
        
        $this->sql = "SELECT $columns FROM " . $table;
        $result = mysqli_query($this->connect, $this->sql);
        
        if ($result) {
            $data = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = $row;
            }
            return $data;
        } else {
            return false;
        }
    }

    /*function storeTimeout($firstname, $lastname, $timeout)
    {
        $firstname = $this->prepareData($firstname);
        $lastname = $this->prepareData($lastname);
        $timeout = $this->prepareData($timeout);

        $this->sql = "UPDATE visitorlogin SET timeout = NOW() WHERE firstname = '$firstname' AND lastname = '$lastname' AND timeout IS NULL"; 
        return mysqli_query($this->connect, $this->sql);
    }*/

    function storeLogbook($firstname, $lastname, $purpose, $timeIn, $date, $timeout)
    {
        $firstname = $this->prepareData($firstname);
        $lastname = $this->prepareData($lastname);
        $purpose = $this->prepareData($purpose);
        $timeIn = $this->prepareData($timeIn);
        $date = $this->prepareData($date);
        $timeout = $this->prepareData($timeout);

        $this->sql = "INSERT INTO logbook (firstname, lastname, purpose, timein, date, timeout) 
                    VALUES ('$firstname', '$lastname', '$purpose', '$timeIn', '$date', '$timeout')"; 
        if (mysqli_query($this->connect, $this->sql)) {
            // If insert was successful, delete the row from the pending table
            return $this->deleteLoginRow($firstname, $lastname);
        } else {
            return false;
        }
    }

    function displayLogbook2($table)
    {
        $columns = 'firstname AS FIRSTNAME, lastname AS LASTNAME, date AS DATE, timein AS `TIME IN`, timeout AS `TIME OUT`, purpose AS PURPOSE';
        
        $this->sql = "SELECT $columns FROM " . $table;
        $result = mysqli_query($this->connect, $this->sql);
        
        if ($result) {
            $data = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = $row;
            }
            return $data;
        } else {
            return false;
        }
    }

    function deleteLoginRow($firstname, $lastname)
    {
        $firstname = $this->prepareData($firstname);
        $lastname = $this->prepareData($lastname);

        // Corrected SQL query
        $this->sql = "DELETE FROM visitorlogin WHERE firstname = '" . $firstname . "' AND lastname = '" . $lastname . "'";
        return mysqli_query($this->connect, $this->sql);
    }

    function deleteUserRow($firstname, $lastname)
    {
        $firstname = $this->prepareData($firstname);
        $lastname = $this->prepareData($lastname);

        // Corrected SQL query
        $this->sql = "DELETE FROM users WHERE firstname = '" . $firstname . "' AND lastname = '" . $lastname . "'";
        return mysqli_query($this->connect, $this->sql);
    }

    function accArchive($table, $id, $firstname, $lastname, $email, $password, $address)
    {
        $id = $this->prepareData($id); 
        $firstname = $this->prepareData($firstname);
        $lastname = $this->prepareData($lastname);
        $email = $this->prepareData($email);
        $password = $this->prepareData($password);
        $address = $this->prepareData($address);

        // Insert the data into the users table
        $this->sql =
            "INSERT INTO " . $table . " (id, firstname, lastname, email, password, address) VALUES ('" . $id . "','" . $firstname . "','" . $lastname . "','" . $email . "','" . $password . "','" . $address . "')";
        if (mysqli_query($this->connect, $this->sql)) {
            // If insert was successful, delete the row from the pending table
            return $this->deleteUserRow($firstname, $lastname);
        } else {
            return false;
        }
    }

    function displayAccountArchive($table)
    {
        $columns = 'id AS ID, firstname AS FIRSTNAME, lastname AS LASTNAME, email AS EMAIL, password AS PASSWORD, address AS ADDRESS';
        
        $this->sql = "SELECT $columns FROM " . $table . " ORDER BY id DESC";
        $result = mysqli_query($this->connect, $this->sql);
        
        if ($result) {
            $data = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = $row;
            }
            return $data;
        } else {
            return false;
        }
    }

    function archiveRestore($table, $id, $firstname, $lastname, $email, $password, $address)
    {
        $id = $this->prepareData($id); 
        $firstname = $this->prepareData($firstname);
        $lastname = $this->prepareData($lastname);
        $email = $this->prepareData($email);
        $password = $this->prepareData($password);
        $address = $this->prepareData($address);

        // Insert the data into the users table
        $this->sql =
            "INSERT INTO " . $table . " (id, firstname, lastname, email, password, address) VALUES ('" . $id . "','" . $firstname . "','" . $lastname . "','" . $email . "','" . $password . "','" . $address . "')";
        if (mysqli_query($this->connect, $this->sql)) {
            // If insert was successful, delete the row from the pending table
            return $this->deleteRow($id);
        } else {
            return false;
        }
    }

    function deleteRow($id)
    {
        $id = $this->prepareData($id);

        $this->sql = "DELETE FROM accarchive WHERE id = '" . $id . "'";
        return mysqli_query($this->connect, $this->sql);
    }

    function deleteArchiveRow($table, $id)
    {
        $table = $this->prepareData($table);
        $id = $this->prepareData($id);
    
        $this->sql = "DELETE FROM $table WHERE id = ?";
        $stmt = mysqli_prepare($this->connect, $this->sql);
        mysqli_stmt_bind_param($stmt, 'i', $id); // Assuming id is an integer
        return mysqli_stmt_execute($stmt);
    }

    function deleteRejectedRow($table, $id)
    {
        $table = $this->prepareData($table);
        $id = $this->prepareData($id);
    
        $this->sql = "DELETE FROM $table WHERE id = ?";
        $stmt = mysqli_prepare($this->connect, $this->sql);
        mysqli_stmt_bind_param($stmt, 'i', $id); // Assuming id is an integer
        return mysqli_stmt_execute($stmt);
    }

    function announcement($content)
    {
        $content = $this->prepareData($content);
        $this->sql = "INSERT INTO announcements (content) VALUES ('$content')";
        if (mysqli_query($this->connect, $this->sql)) {
            return true;
        } else {
            return false;
        }
    }

}
?>