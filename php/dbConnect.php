<?php
    include "constants.php";
    function dbConnect(){
        try {
            $dsn = "pgsql:host=" . dbserver . ";port=" . dbport . ";dbname=" . dbname . ";user=" . dbuser . ";password=" . db_pwd;
            $conn = new PDO($dsn, dbuser, db_pwd);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
            return null; 
        }
    }

    
?>
