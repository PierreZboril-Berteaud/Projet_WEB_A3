<?php

require_once('dbConnect.php');

ini_set('display_errors', 1);
error_reporting(E_ALL);


$db = dbConnect();
if (!$db) {
    header('HTTP/1.1 503 Service Unavailable');
    exit;
}



$req = $_SERVER['REQUEST_METHOD'];

// Récupération de l'action depuis le paramètre GET "action" 
$requestRessource = $_GET['action'] ?? null;

if (empty($requestRessource)) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['error' => 'Aucune action spécifiée']);
    exit;
}

header('Content-Type: application/json');
switch ($requestRessource) {

    case 'home':
        if ($req === 'GET') {
            $data = ['message' => 'Page d\'accueil', 'content' => 'home'];
            header('HTTP/1.1 200 OK');
        } else {
            header('HTTP/1.1 405 Method Not Allowed');
            echo json_encode(['error' => 'Méthode non autorisée']);
            exit;
        }
        break;

    case 'ajoutNavire':
        if ($req === 'GET') {
            $data = ['message' => 'Formulaire ajout navire', 'content' => 'ajoutNavire'];
            header('HTTP/1.1 200 OK');
        } else {
            header('HTTP/1.1 405 Method Not Allowed');
            echo json_encode(['error' => 'Méthode non autorisée']);
            exit;
        }
        break;

    case 'ajoutNavireBdd':
        if ($req==='POST'){

            $MMSI = htmlspecialchars($_POST['MMSI']);
            $date = htmlspecialchars($_POST['date']);

            $dateTime = DateTime::createFromFormat('Y-m-d\TH:i:s', $date);
            $formattedDate = $dateTime->format('Y-m-d H:i:s');

            $latitude = htmlspecialchars($_POST['latitude']);
            $longitude = htmlspecialchars($_POST['longitude']);
            $SOG = htmlspecialchars($_POST['SOG']);
            $COG = htmlspecialchars($_POST['COG']);
            $Heading = htmlspecialchars($_POST['Heading']);
            $Nom = htmlspecialchars($_POST['Nom']);
            $Etat = htmlspecialchars($_POST['Etat']);
            $Longueur = htmlspecialchars($_POST['Longueur']);
            $Largeur = htmlspecialchars($_POST['Largeur']);
            $Draft = htmlspecialchars($_POST['Draft']);
            $VesselType = htmlspecialchars($_POST['VesselType']);
            $Cargo = htmlspecialchars($_POST['Cargo']);

            $data = dbAddNavire($db, $MMSI, $formattedDate, $latitude, $longitude, $SOG, $COG, $Heading, $Nom, $Etat, $Longueur, $Largeur, $Draft, $VesselType, $Cargo);
            if($data != true){
                header('HTTP/1.1 401 Unauthorized');
                
            }
            else{
                header('HTTP/1.1 200 OK');

            }
        }
        break;
    case 'AfficheTableau':
        if ($req === 'GET') {
            $data = "Page Affiche Tableau";
            header('HTTP/1.1 200 OK');
        } else {
            header('HTTP/1.1 405 Method Not Allowed');
            echo json_encode(['error' => 'Méthode non autorisée']);
            exit;
        }
        break;
    case 'GetNavire':
        if($req==='GET'){
            $limit = $_GET['limit'];
        
            $data=dbGetNavire($db,$limit);

        }
        break;
    case 'GetNavireRd':
        if($req==='GET'){
            $limit = $_GET['limit'];
            $data=dbGetNavireRd($db,$limit);
        }
        break;
    case 'predictType':
        
        if($req==='POST'){

            $MMSI = htmlspecialchars($_POST['mmsi']);
            $Longueur = htmlspecialchars($_POST['Length']);
            $Largeur = htmlspecialchars($_POST['Width']);
            $Draft = htmlspecialchars($_POST['Draft']);
            
            $data=dbGetTypePrediction($Longueur,$Largeur,$Draft);
            
        }
        break;
    case 'predictposition':
        if($req==='POST'){
            
            $MMSI = htmlspecialchars($_POST['mmsi']);
            $date = htmlspecialchars($_POST['date']);

            /*$dateTime = DateTime::createFromFormat('Y-m-d\TH:i:s', $date);
            $formattedDate = $dateTime->format('Y-m-d H:i:s');*/

            $longueur = htmlspecialchars($_POST['length']);
            $largeur = htmlspecialchars($_POST['width']);   
            $draft = htmlspecialchars($_POST['draft']);
            $latitude = htmlspecialchars($_POST['latitude']);
            $longitude = htmlspecialchars($_POST['longitude']);
            $SOG = htmlspecialchars($_POST['sog']);
            $COG = htmlspecialchars($_POST['cog']);
            $Heading = htmlspecialchars($_POST['heading']);
            $time = htmlspecialchars($_POST['time']);
            
            $data=dbPredictPosition($db, $MMSI, $latitude, $longitude, $SOG, $COG, $Heading, $longueur, $largeur, $draft, $time);
            $data[] = $date;
            $data[]  = $time;
            $data[] = $latitude;
            $data[] = $longitude;
        }
        break;
    case 'predictclusters':
        if($req==='POST'){
            $jsonData = file_get_contents("php://input");
            $navires = json_decode($jsonData, true);
            $results = [];

            foreach ($navires as $navire) {
                $MMSI = htmlspecialchars($navire['mmsi']);
                $latitude = htmlspecialchars($navire['latitude']);
                $longitude = htmlspecialchars($navire['longitude']);
                $SOG = htmlspecialchars($navire['sog']);
                $COG = htmlspecialchars($navire['cog']);
                $Heading = htmlspecialchars($navire['heading']);

                $cluster = dbPredictClusters($latitude, $longitude, $SOG, $COG, $Heading);
                $results[] = [
                    'mmsi' => $MMSI,
                    'cluster' => $cluster,
                    'latitude' => $latitude,
                    'longitude' => $longitude
                ];
                
            }
            $data = $results;
        }
        break;
    default:
        header('HTTP/1.1 404 Not Found');
        echo json_encode(['error' => 'Action inconnue']);
        exit;
}
// Réponse JSON
echo json_encode($data);
exit;
