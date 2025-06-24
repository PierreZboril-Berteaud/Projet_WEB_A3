
ajaxRequest('GET', '../php/request.php?action=home', displayInfos);
$('#Accueil').click(() => {
  ajaxRequest('GET', '../php/request.php?action=home', displayInfos);
});

function clearPage(){ // Permet de vider la page
  $('#infos').html('');
  $('#AjoutNavireForm').html('');
}

function displayInfos() {
  clearPage();
  let html = `
    <div id="infos-container">
      <img src="../images/Bateau_1.jpeg" alt="logo" id="infos-image">
      <div id="infos-text">
        <p class="welcome">Bienvenue sur</p>
        <h4>Projet Big Data / IA / WEB</h4>
        <p class="description">
          Analyse et Modélisation des Comportements de Navigation des Navires à partir des Données AIS
        </p>
        <h4>Prédiction</h4>
        <p class="prediction">
          Le système permet de prévoir la trajectoire probable d'un navire en temps réel, en exploitant les données AIS collectées.
        </p>
      </div>
    </div>
  `;
  $('#infos').html(html);
}

