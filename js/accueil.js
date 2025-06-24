
ajaxRequest('GET', '../php/request.php?action=home', displayInfos);

$('#Accueil').click(() => {
  ajaxRequest('GET', '../php/request.php?action=home', displayInfos);
});

function clearPage(){ // Permet de vider la page
  $('#infos').html('');
  $('#AjoutNavireForm').html('');

}

function displayInfos() // Affiche les informations de la page d'accueil
{
    
  clearPage();
  let html = `
    <img src="../images/Bateau_1.jpeg" alt="logo">
    <div id="infos-text" class="m-3">
      <p class="text-center">Bienvenue sur <b>Titre</b>...texte...</p>
      <div>
        <h4>Comment ça marche ?</h4>
        <p style="text-align: justify;">...texte...</p>
      </div>
      <div>
        <h4>Prediction</h4>
        <p class="text-justify">...texte...</p>
      </div>
    </div>
  `;
  $('#infos').html(html);

}

