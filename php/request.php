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

            $data = dbAddNavire($db, $MMSI, $date, $latitude, $longitude, $SOG, $COG, $Heading, $Nom, $Etat, $Longueur, $Largeur, $Draft);
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
    case 'PageClusters':
        if ($req === 'GET') {
            $data = ['message' => 'Page Clusters', 'content' => 'PageClusters'];
            header('HTTP/1.1 200 OK');
        } else {
            header('HTTP/1.1 405 Method Not Allowed');
            echo json_encode(['error' => 'Méthode non autorisée']);
            exit;
        }
        break;
    case 'GetNavire':
        if($req==='GET'){
            $data=dbGetNavire($db);
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
