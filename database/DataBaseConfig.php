<?php

class DataBaseConfig
{
    public $servername;
    public $email;
    public $password;
    public $databasename;

    public function __construct()
    {

        $this->servername = 'localhost';
        $this->email = 'root';
        $this->password = '';
        $this->databasename = 'loginregister';

    }
}

?>
