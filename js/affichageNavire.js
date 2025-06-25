//si l'utilisateur clique sur le bouton, on fait une requête AJAX
$("#AffichageNavire").click(() => {
  ajaxRequest('GET', '../php/request.php?action=AfficheTableau', DisplayTablePage);
});

//fonction appelée après la réception des données des bateaux 
function DisplayTablePage() {
    clearPage(); //vider le contenu principal
    ajaxRequest('GET', '../php/request.php?action=GetNavire', displayNavireTable);
}

function displayNavireTable(response) {
    let html = `
    <div class="row">
        <div class="col-md-6">
            <h3>Liste des bateaux</h3>
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
            
            <div class="d-flex justify-content-between my-3">
                <button id="predictButton" class="btn btn-primary">Prédire Le Type</button>
                <button id="positionButton" class="btn btn-primary">Prédire La Position</button>
                <button id="plotMapButton" class="btn btn-success">Afficher sur la carte</button>
            </div>
        </div>
        
        <div class="col-md-6">
            <h3>Carte des bateaux</h3>
            <div id="mapDiv" style="height: 600px; border: 1px solid #ddd; border-radius: 4px;"></div>
        </div>
  let html = `
  <h3> Liste des bateaux </h3>
  <input type="text" id="filter-name" placeholder="Filtrer par nom de navire" value="${filterName}" style="margin-bottom: 10px; padding: 5px; width: 100%;">
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
            </tr>
            `;
            tbody.append(row);
        }
        
        // Afficher tous les bateaux sur la carte par défaut
        plotAllBoatsOnMap(response);
    }
    
    // Gestion des événements
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
            const queryString = new URLSearchParams(data).toString();
            ajaxRequest('POST', '../php/request.php?action=predictType', displayPredictPage, queryString);
        } else {
            alert("Veuillez sélectionner un navire pour la prédiction.");
        }
    });

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
                heading: response[selectedIndex].heading
            };
            const queryString = new URLSearchParams(data).toString();
            ajaxRequest('POST', `../php/request.php?action=PredictPosition&time=${time}`, displayPredictionPosition, queryString);
        } else {
            alert("Veuillez sélectionner un navire pour la prédiction.");
        }
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