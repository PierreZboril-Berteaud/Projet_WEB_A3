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

    
    function dbAddNavire($db, $MMSI, $date, $latitude, $longitude, $SOG, $COG, $Heading, $Nom, $Etat, $Longueur, $Largeur, $Draft,$VesselType, $Cargo)
    {
    try {
        $db->beginTransaction();
        $queryCheck = "SELECT MMSI FROM Bateau WHERE MMSI = :MMSI";
        $stmtCheck = $db->prepare($queryCheck);
        $stmtCheck->bindParam(':MMSI', $MMSI, PDO::PARAM_STR);
        $stmtCheck->execute();

        if (!$stmtCheck->fetch()) {
            $queryBateau = "INSERT INTO Bateau (mmsi, nom, longueur, largeur, draft, vesseltype, cargo) 
                            VALUES (:MMSI, :Nom, :Longueur, :Largeur, :Draft,:VesselType, :Cargo)";
            $stmtBateau = $db->prepare($queryBateau);
            $stmtBateau->bindParam(':MMSI', $MMSI, PDO::PARAM_STR);
            $stmtBateau->bindParam(':Nom', $Nom, PDO::PARAM_STR);
            $stmtBateau->bindParam(':Longueur', $Longueur);
            $stmtBateau->bindParam(':Largeur', $Largeur);
            $stmtBateau->bindParam(':Draft', $Draft);
            $stmtBateau->bindParam(':VesselType', $VesselType);
            $stmtBateau->bindParam(':Cargo', $Cargo);
            $stmtBateau->execute();
        }
    
        $queryHist = "INSERT INTO Historique (mmsi, basedatetime, vesselstatus) 
                      VALUES (:MMSI, :BaseDateTime, :VesselStatus) RETURNING id_date";
        $stmtHist = $db->prepare($queryHist);
        $stmtHist->bindParam(':MMSI', $MMSI, PDO::PARAM_STR);
        $stmtHist->bindParam(':BaseDateTime', $date, PDO::PARAM_STR);
        $stmtHist->bindParam(':VesselStatus', $Etat, PDO::PARAM_INT);
        $stmtHist->execute();
        $id_date = $stmtHist->fetchColumn();

        // 3. Insérer dans Position
        $queryPos = "INSERT INTO Position (mmsi, id_date, lat, lon, sog, cog, heading) 
                     VALUES (:MMSI, :id_date, :Lat, :Lon, :SOG, :COG, :Heading)";
        $stmtPos = $db->prepare($queryPos);
        $stmtPos->bindParam(':MMSI', $MMSI, PDO::PARAM_STR);
        $stmtPos->bindParam(':id_date', $id_date, PDO::PARAM_INT);
        $stmtPos->bindParam(':Lat', $latitude);
        $stmtPos->bindParam(':Lon', $longitude);
        $stmtPos->bindParam(':SOG', $SOG);
        $stmtPos->bindParam(':COG', $COG);
        $stmtPos->bindParam(':Heading', $Heading);
        $stmtPos->execute();

        $db->commit();


        return true;
    } 
    catch (PDOException $exception) {
        $db->rollBack();
        error_log('Request error: ' . $exception->getMessage());
        return false;
    }
}

function dbGetNavire($db,$limit){
    try {
        $query = "SELECT 
                b.mmsi, 
                h.basedatetime,
                p.lat,
                p.lon,
                p.sog,
                p.cog,
                p.heading,
                b.nom AS nom_bateau,
                h.vesselstatus,
                b.longueur,
                b.largeur,
                b.draft
            FROM 
                Bateau b
            JOIN 
                Historique h ON b.MMSI = h.MMSI
            JOIN 
                Position p ON h.MMSI = p.MMSI AND h.id_date = p.id_date
            ORDER BY 
                b.nom, h.basedatetime
            LIMIT $limit;";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    } catch (PDOException $e) {
        error_log('Request error: ' . $e->getMessage());
        return false;
    }
}



    function dbGetTypePrediction($Longueur,$Largeur,$Draft){
        $result=[];
        $command = "python3 ../python/main_fonc_2.py --Predict True --Model RandomForest --Length $Longueur --Width $Largeur --Draft $Draft";
        #escapeshellcmd("python3 ../python/main_fonc_2.py --Predict True --Model RandomForest --Length $Longueur --Width $Largeur --Draft $Draft") . " 2>&1" //Pour tester erreurs

        #$command = "python3 ../python/test.py";
        exec($command, $result);

        if (empty($result)) {
            return false;
        }
        return $result;   
    }
    function dbGetCargo($db, $MMSI){
        try {
            $query = "SELECT cargo FROM Bateau WHERE MMSI = :MMSI";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':MMSI', $MMSI, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchColumn();
        } catch (PDOException $e) {
            error_log('Request error: ' . $e->getMessage());
            return false;
        }
    }
    function dbGetVesselType($db, $MMSI){
        try {
            $query = "SELECT vesseltype FROM Bateau WHERE MMSI = :MMSI";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':MMSI', $MMSI, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchColumn();
        } catch (PDOException $e) {
            error_log('Request error: ' . $e->getMessage());
            return false;
        }
    }
    function dbPredictPosition($db, $MMSI, $latitude, $longitude, $SOG, $COG, $Heading, $longueur, $largeur, $draft, $time){
        $cargo = dbGetCargo($db, $MMSI);
        $vesselType = dbGetVesselType($db, $MMSI);

        $result = [];
        $command = "python3 ../python/main_fonc_3.py"
            . " --LAT $latitude"
            . " --LON $longitude"
            . " --SOG $SOG"
            . " --COG $COG"
            . " --Heading $Heading"
            . " --VesselType $vesselType"
            . " --Length $longueur"
            . " --Width $largeur"
            . " --Draft $draft"
            . " --Cargo $cargo"
            . " --time $time";
        exec($command, $result);
        return $result;
    }
    function dbPredictClusters($latitude, $longitude, $SOG, $COG, $Heading){
        $result = [];
        $command = "python3 ../python/main_fonc_1.py"
            . " --Predict True"
            . ' --Model Kmeans'
            . " --LAT $latitude"
            . " --LON $longitude"
            . " --SOG $SOG"
            . " --COG $COG"
            . " --Heading $Heading";
        exec($command, $result);
        return $result;
        
    }
?>
