//si l'utilisateur clique sur le bouton, on fait une requête AJAX
$("#AffichageNavire").click(() => {
  ajaxRequest('GET', '../php/request.php?action=AfficheTableau', DisplayTablePage);
});


//fonction appelée après la réception des données des bateaux 
function DisplayTablePage(){
    clearPage(); //vider le contenu principal
    ajaxRequest('GET','../php/request.php?action=GetNavire',displayNavireTable)
}


function displayNavireTable(response) {
  let html = `
  <h3> Liste des bateaux </h3>
  <div class="scroller">
      <table id="tabletable_bateau" class="container">
          <thead>
              <tr>
                  <th>MMSI</th>
                  <th>Hordatage</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>SOG</th>
                  <th>COG</th>
                  <th>Cap réel</th>
                  <th>Nom</th>
                  <th>Etat</th>
                  <th>Longueur</th>
                  <th>Largeur</th>
                  <th>Tirant d'eau</th>
                  <th>Prediction</th>
              </tr>
          </thead>
        </table>
    </div>
          `; 
    $('#TableauNavire').html(html);

  if (response.length !== 0) {
  for (let i = 0; i < response.length; i++) {
    let row = `
      <tr data-index="${i}">
        <td>${response[i].mmsi}</td>
        <td>${response[i].basedatetime}</td>
        <td>${response[i].lat}</td>
        <td>${response[i].lon}</td>
        <td>${response[i].sog}</td>
        <td>${response[i].cog}</td>
        <td>${response[i].heading}</td>
        <td>${response[i].nom_bateau}</td>
        <td>${response[i].vesselstatus}</td>
        <td>${response[i].longueur}</td>
        <td>${response[i].largeur}</td>
        <td>${response[i].draft}</td>
        <td>
          <input type="radio" name="Prediction-Type-Navire" class="predict-radio" data-index="${i}">
        </td>
    </tr>
    `;
    $("table.container").append(row);
    
    }
  }
  
  let button=`
  <div class="d-flex justify-content-between my-3">
    <button id="predictButton" class="btn btn-primary">Prédire Le Type</button>
    <button id="positionButton" class="btn btn-primary">Prédire La Position</button>
  </div>`;

  $('#TableauNavire').append(button);

  $('#predictButton').click(() => {
    let selectedIndex = $("input[name='Prediction-Type-Navire']:checked").data('index');

    if (selectedIndex !== undefined) {
      const data = {
      mmsi: response[selectedIndex].mmsi,
      Length: response[selectedIndex].longueur,
      Width: response[selectedIndex].largeur,
      Draft: response[selectedIndex].draft
    };
    console.log(data)
    const queryString = new URLSearchParams(data).toString();
    console.log(queryString)


      ajaxRequest('POST', '../php/request.php?action=predictType',displayPredictPage,queryString);

    //console.log(`Prédiction du type pour le navire MMSI: ${response[selectedIndex].mmsi}`);
    } else {
      alert("Veuillez sélectionner un navire pour la prédiction.");
    }
  })

  $('#positionButton').click(() => {
    let selectedIndex = $("input[name='Prediction-Type-Navire']:checked").data('index');
    if (selectedIndex !== undefined) {

      let timeInput = prompt("Entrez le temps (en secondes) pour la prédiction de position :");
      let time = parseInt(timeInput);
      if (isNaN(time) || time <= 0) {
        alert("Veuillez entrer un nombre valide pour le temps.");
        return;
      }
      const data = {
      mmsi: response[selectedIndex].mmsi,
      Length: response[selectedIndex].longueur,
      Width: response[selectedIndex].largeur,
      Draft: response[selectedIndex].draft,
      Latitude: response[selectedIndex].lat,
      Longitude: response[selectedIndex].lon,
      sog: response[selectedIndex].sog,
      cog: response[selectedIndex].cog,
      heading: response[selectedIndex].heading,

    };
      const queryString = new URLSearchParams(data).toString();
      console.log(queryString)
    
      ajaxRequest('POST', `../php/request.php?action=PredictPosition`, displayPredictionPosition, queryString);
    } else {
      alert("Veuillez sélectionner un navire pour la prédiction.");
    }
  })
  }
