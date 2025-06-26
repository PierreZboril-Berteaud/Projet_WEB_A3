//si l'utilisateur clique sur le bouton, on fait une requête AJAX
$("#AffichageNavire").click(() => {
  ajaxRequest('GET', '../php/request.php?action=AfficheTableau', DisplayTablePage);
});


//fonction appelée après la réception des données des bateaux 
function DisplayTablePage() {
  clearPage(); //vider le contenu principal
  ajaxRequest('GET', '../php/request.php?action=GetNavire', displayNavireTable)
}


function displayNavireTable(response) {
  let html = `
  <div style="display: flex; align-items: center; gap: 10px;margin-top: 20px; flex-wrap: wrap;">
  <input type="text" id="filterMMSI" placeholder="Entrez un MMSI..." class="form-control" style="max-width: 300px; flex-shrink: 0;">
  
  <label for="limitSelect" style="margin-bottom: 0; white-space: nowrap;">Nombre de bateaux :</label>
  
  <select id="limitSelect" class="form-select" style="width: auto; max-width: 100px; flex-shrink: 0;">
    <option value="10">10</option>
    <option value="25" selected>25</option>
    <option value="50">50</option>
    <option value="100">100</option>
    <option value="500">500</option>
    <option value="1000">1000</option>
    <option value="10000">10000</option>
  </select>
  
  <button id="filterBtn" class="btn btn-primary" style="flex-shrink: 0;">Filtrer</button>
<div class="row">
        <div class="col-md-12">
            <h3 class="text-center mb-6"  >Liste des bateaux</h3>
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
                    <tbody></tbody>
                </table>
            </div>
            
            <div style="display: flex; gap: 10px; margin: 1rem 0;">
              
              <button id="plotMapButton" class="btn btn-success">Afficher sur la carte</button>
              <button id="predictButton" class="btn btn-primary">Prédire Le Type</button>
              <button id="positionButton" class="btn btn-primary">Prédire La Position</button>
              <button id="clusterButton" class="btn btn-primary">Prédire Les clusters</button>
            </div>
        </div>
        
    </div>
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <h3 class="text-center mb-4">Carte des bateaux</h3>
            <div id="mapDiv" style="height: 600px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"></div>
        </div>
    </div>
</div>
    </div>
          `;
  $('#TableauNavire').html(html);
  $('#filterBtn').on('click', function () {
    let mmsiValue = $('#filterMMSI').val().trim();      // Récupère la valeur du input MMSI
    const limitValue = $('#limitSelect').val();          // Récupère la valeur sélectionnée dans le select
    if (!mmsiValue) {
      mmsiValue = '1'
    }
    console.log("MMSI:", mmsiValue);
    console.log("Limite:", limitValue);
    ajaxRequest('GET', `../php/request.php?action=GetNavire&limit=${limitValue}&mmsi=${mmsiValue}`, displayNavireTableFiltered);
  });
}



function displayNavireTableFiltered(response) {

  if (response.length !== 0) {
    let tbody = $('#tabletable_bateau tbody');
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
        </tr>`;
      tbody.append(row);

    }
    plotAllBoatsOnMap(response);

  }

  /*let button=`
  <div class="d-flex justify-content-between my-3">
    <button id="predictButton" class="btn btn-primary">Prédire Le Type</button>
    <button id="positionButton" class="btn btn-primary">Prédire La Position</button>
  </div>`;*/

  //$('#TableauNavire').append(button);
  $('#plotMapButton').click(() => {
    let selectedIndex = $("input[name='Prediction-Type-Navire']:checked").data('index');
    if (selectedIndex !== undefined) {
      plotSelectedBoatOnMap(response, selectedIndex);
    } else {
      plotAllBoatsOnMap(response);
    }
  });

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


      ajaxRequest('POST', '../php/request.php?action=predictType', displayPredictPage, queryString);

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
  $('#clusterButton').click(() => {
    if (!response || response.length === 0) {
      alert("Aucun navire disponible pour le clustering.");
      return;
    }
    // Tout les bateaux présents dans la table sont mis dans ce navire 
    const clusterData = response.map(boat => ({
      mmsi: boat.mmsi,
      latitude: boat.lat,
      longitude: boat.lon,
      sog: boat.sog,
      cog: boat.cog,
      heading: boat.heading,
    }));
    console.log(clusterData)
    // Envoyer la requête AJAX pour demander le clustering
    data_j = JSON.stringify(clusterData);
    ajaxRequest('POST', '../php/request.php?action=predictclusters', displayClusterResults, data_j);
  });


}

function plotAllBoatsOnMap(response) {
  if (response.length === 0) return;

  let data = [{
    type: "scattermapbox",
    lat: response.map(boat => boat.lat),
    lon: response.map(boat => boat.lon),
    text: response.map(boat =>
      `${boat.nom_bateau}<br>SOG: ${boat.sog} kn<br>COG: ${boat.cog}°`
    ),
    marker: {
      color: response.map(() => getRandomColor()),
      size: 8
    },
    hoverinfo: 'text',
    mode: 'markers'
  }];


  let layout = {
    dragmode: "zoom",
    mapbox: {
      style: "open-street-map",
      center: {
        lat: 25,
        lon: -90
      },
      zoom: 4.25
    },
    margin: { r: 0, t: 0, b: 0, l: 0 },
    showlegend: false
  };

  Plotly.newPlot("mapDiv", data, layout);
}

function plotSelectedBoatOnMap(response, index) {
  let selectedRow = response[index];

  let data = [{
    type: "scattermapbox",
    lat: [selectedRow.lat],
    lon: [selectedRow.lon],
    text: [selectedRow.nom_bateau],
    marker: {
      color: "red",
      size: 3
    },
    hoverinfo: 'text',
    mode: 'markers'
  }];

  let layout = {
    dragmode: "zoom",
    mapbox: {
      style: "open-street-map",
      center: {
        lat: selectedRow.lat,
        lon: selectedRow.lon
      },
      zoom: 3
    },
    margin: { r: 0, t: 0, b: 0, l: 0 }
  };

  Plotly.newPlot("mapDiv", data, layout);
}

// Fonction utilitaire pour générer des couleurs aléatoires
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}