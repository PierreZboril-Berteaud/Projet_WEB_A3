function ajaxRequest(type, url, callback, data = null)
{
  let xhr = new XMLHttpRequest();

  if (type === 'GET' && data != null)
    url += '?' + data;

  xhr.open(type, url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = () =>
  {
    switch (xhr.status)
    {
      case 200:
      case 201:
        if (xhr.responseText.trim() !== "") {
          try {
            callback(JSON.parse(xhr.responseText));
          } catch (e) {
            console.warn("Réponse non JSON, appel direct du callback.");
            callback(); // on appelle quand même
          }
        } else {
          callback(); // si pas de réponse, on appelle juste la fonction
        }
        break;
      default:
        httpErrors(xhr.status);
    }
  };

  xhr.send(data);
}




function httpErrors(errorCode)
{
  let messages =
  {
    400: 'Requête incorrecte',
    401: 'Authentifiez vous',
    403: 'Accès refusé',
    404: 'Page non trouvée',
    500: 'Erreur interne du serveur',
    503: 'Service indisponible'
  };

  // Display error.
  if (errorCode in messages)
  {
    $('#errors').html('<i class="fa fa-exclamation-circle"></i> <strong>' +
      messages[errorCode] + '</strong>');
    $('#errors').show();
  }
}