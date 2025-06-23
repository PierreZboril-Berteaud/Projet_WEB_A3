<?php

    require_once('dbConnect.php');
    ini_set('display_errors',1);
    error_reporting(E_ALL);

    session_start();

    $db = dbConnect();
    if (!$db)
    {
        header('HTTP/1.1 503 Service Unavailable');
        exit;
    } 

    $req = $_SERVER['REQUEST_METHOD']; 

    $request = substr($_SERVER['PATH_INFO'], 1); 
    $request = explode('/', $request);
    $requestRessource = array_shift($request);

    
    if (empty($requestRessource)){
        header('HTTP/1.1 400 Bad Request');
        exit;
    }

    if($requestRessource == 'home'){
        $data = 'home';
        if($req == 'GET'){
            header('HTTP/1.1 200 OK');
        }
    }


/*

switch ($requestRessource) {
    case 'client':
        switch ($request_method) {
            case 'GET':
                if ($id!=NULL) {
                    $data = get_clientsById($id);
                } else {
                    $data = get_allclients();
                }
                break;

            default:
                header("HTTP/1.0 405 Method Not Allowed");
                break;
        }
        break;

    case 'log_client':
        switch ($request_method) {
            case 'GET':
                if ($email != '' && $mdp != '') { 
                    $hashedPasswordFromDatabase = getPasswordByEmail_Hash_Client($email);
                    if ($hashedPasswordFromDatabase !== null && password_verify($mdp, $hashedPasswordFromDatabase)) {
                        $data = array('prenom' => getPrenomByEmailClient($email), 'nom' => getNomByEmailClient($email), 'email' => $email, 'profile' => 1, 'id' => getClientId($email));
                        break;
                    }
                }
                break;
                default:
                    header("HTTP/1.0 405 Method Not Allowed");
                    break;
            }
            break;                   
    }

    header('Content-Type: application/json');
    echo json_encode($data);
exit;
*/
?>