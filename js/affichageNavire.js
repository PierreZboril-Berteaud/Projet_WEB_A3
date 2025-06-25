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
  <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
  <input type="text" id="filterMMSI" placeholder="Entrez un MMSI..." class="form-control" style="max-width: 300px; flex-shrink: 0;">
  
  <label for="limitSelect" style="margin-bottom: 0; white-space: nowrap;">Nombre de bateaux :</label>
  
  <select id="limitSelect" class="form-select" style="width: auto; max-width: 100px; flex-shrink: 0;">
    <option value="10">10</option>
    <option value="25" selected>25</option>
    <option value="50">50</option>
    <option value="100">100</option>
  </select>
  
  <button id="filterBtn" class="btn btn-primary" style="flex-shrink: 0;">Filtrer</button>
</div>
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
    $('#filterBtn').on('click', function() {
      let mmsiValue = $('#filterMMSI').val().trim();      // Récupère la valeur du input MMSI
      const limitValue = $('#limitSelect').val();          // Récupère la valeur sélectionnée dans le select
      if(!mmsiValue) {
        mmsiValue = '1'
      }
      console.log("MMSI:", mmsiValue);
      console.log("Limite:", limitValue);
      ajaxRequest('GET', `../php/request.php?action=GetNavire&limit=${limitValue}&mmsi=${mmsiValue}`, displayNavireTableFiltered);
    });
  }


  function displayNavireTableFiltered(response){
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
      let time_v = parseInt(timeInput);
      if (isNaN(time_v) || time_v <= 0) {
        alert("Veuillez entrer un nombre valide pour le temps.");
        return;
      }
      const data = {
      mmsi: response[selectedIndex].mmsi,
      date: response[selectedIndex].basedatetime,
      length: response[selectedIndex].longueur,
      width: response[selectedIndex].largeur,
      draft: response[selectedIndex].draft,
      latitude: response[selectedIndex].lat,
      longitude: response[selectedIndex].lon,
      sog: response[selectedIndex].sog,
      cog: response[selectedIndex].cog,
      heading: response[selectedIndex].heading,
      time: time_v
    };
      console.log(data);
      const query = new URLSearchParams(data).toString();
      console.log(query)
    
      ajaxRequest('POST', `../php/request.php?action=predictposition`, displayPredictionPosition, query);
    } else {
      alert("Veuillez sélectionner un navire pour la prédiction.");
    }
  })
    
}