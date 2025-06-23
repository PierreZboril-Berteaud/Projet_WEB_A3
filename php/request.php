<?php

require('database.php');

$request_method = $_SERVER["REQUEST_METHOD"];
$request = substr($_SERVER['PATH_INFO'], 1);
$request = explode('/', $request);

$requestRessource = array_shift($request);
$request_uri = $_SERVER['REQUEST_URI'];

$params = parse_url($request_uri, PHP_URL_QUERY);
parse_str($params, $query_params);

$nom = $query_params['nom'] ?? '';
$prenom = $query_params['prenom'] ?? '';
$tel = $query_params['tel'] ?? '';
$email = $query_params['mail'] ?? '';
$email_confirm = $query_params['mail_confirm'] ?? '';
$mdp = $query_params['mdp'] ?? '';
$mdp_confirm = $query_params['mdp_confirm'] ?? '';
$ville = $query_params['ville'] ?? '';
$specialite = $query_params['specialite'] ?? '';
$type = $query_params['type'] ?? '';
$id_ref = $query_params['id_ref'] ?? '';
$date = $query_params['date'] ?? '';
$id_medecin = $query_params['id_medecin'] ?? '';
$id_client = $query_params['id_client'] ?? '';
$heure = $query_params['heure'] ?? '';
$id_rdv = $query_params['id_rdv'] ??'';
$heure_debut = $query_params['heure_debut'] ??'';
$heure_fin = $query_params['heure_fin'] ??'';
$id_heure = $query_params['id_heure'] ??'';
$code_postal = $query_params['code_postal'] ??'';
$adresse = $query_params['adresse'] ??'';
$data = false;
$id = array_shift($request);
$info = array_shift($request);






if ($id == '') {
    $id = NULL;
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