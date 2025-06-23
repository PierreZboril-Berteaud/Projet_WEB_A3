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

    default:
        header('HTTP/1.1 404 Not Found');
        echo json_encode(['error' => 'Action inconnue']);
        exit;
}

// Réponse JSON
echo json_encode($data);
exit;
