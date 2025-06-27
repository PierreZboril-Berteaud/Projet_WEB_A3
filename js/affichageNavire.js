// Variables globales pour pagination
let currentPage = 1;
const rowsPerPage = 10; // Nombre de lignes par page
let navireData = []; // Stockage global des données navires

// Si l'utilisateur clique sur le bouton, on fait une requête AJAX
$("#AffichageNavire").click(() => {
  ajaxRequest('GET', '../php/request.php?action=AfficheTableau', DisplayTablePage);
});

// Fonction appelée après la réception des données des bateaux 
function DisplayTablePage(){
    clearPage(); //vider le contenu principal
    ajaxRequest('GET','../php/request.php?action=GetNavire',displayNavireTable)
}

function displayNavireTable(response) {
  // Fonction pour afficher le tableau des navires
  let html = `
  <div style="display: flex; align-items: center; gap: 10px;  margin-top: 10px; flex-wrap: wrap;">
  <input type="text" id="filterMMSI" placeholder="Entrez un MMSI..." class="form-control" style="max-width: 300px; flex-shrink: 0;">
  
  <label for="limitSelect" style="margin-bottom: 0; white-space: nowrap;">Nombre de bateaux :</label>
  
  <input 
    id="limitSelect" 
    name="limit" 
    type="text" 
    class="form-control" 
    style="width: 100px;" 
    placeholder="Ex: 25 ou ALL" 
    value="25" 
  />

  <div style="display: flex; align-items: center; gap: 5px; flex-shrink: 0;">
    <label style="margin-bottom: 0;">Aléatoire :</label>
    <div>
      <input type="radio" id="randomYes" name="randomSelect" value="yes">
      <label for="randomYes">Oui</label>
    </div>
    <div>
      <input type="radio" id="randomNo" name="randomSelect" value="no" checked>
      <label for="randomNo">Non</label>
    </div>
  </div>

  <button id="filterBtn" class="my-btn-primary" style="flex-shrink: 0;">Filtrer</button>
<div class="row">
        <div class="col-md-12">
            <h3 style="color:#0077be; text-align: center;">Liste des bateaux</h3>
            <div class="scroller">
    <table id="tabletable_bateau" class="table table-striped table-bordered">
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
        <tbody id="bateau-body">
        </tbody>
    </table>
</div>
             
            <nav aria-label="Page navigation example">
              <ul class="pagination justify-content-center" id="pagination">
              </ul>
            </nav>

            <div style="display: flex; gap: 10px; margin: 1rem 0;">
              
              <button id="plotMapButton" class="my-btn-success">Afficher sur la carte</button>
              <button id="predictButton" class="my-btn-primary">Prédire Le Type</button>
              <button id="positionButton" class="my-btn-primary">Prédire La Position</button>
              <button id="clusterButton" class="my-btn-primary">Prédire Les clusters</button>
            </div>
        </div>
        
        
    </div>
    <div class="col-md-6">
            <h3 style="color:#0077be; text-align: center;">Carte des bateaux</h3>
            <div id="mapDiv" style="height: 600px; border: 1px solid #ddd;margin: 0 auto;text-align: center; border-radius: 4px;"></div>
        </div>
    
          `; 
  $('#TableauNavire').html(html);

  $('#filterBtn').on('click', function() {
      
      let mmsiValue = $('#filterMMSI').val().trim();      // Récupère la valeur du input MMSI
      const limitValue = $('#limitSelect').val();          // Récupère la valeur sélectionnée dans le select
      const isRandom = $('input[name="randomSelect"]:checked').val(); // "yes" ou "no"

      if(!mmsiValue) {
        mmsiValue = '1'
      }
      if (isRandom === 'no') {
        ajaxRequest('GET', `../php/request.php?action=GetNavire&limit=${limitValue}&mmsi=${mmsiValue}`, displayNavireTableFiltered);
      }
      else{
        ajaxRequest('GET', `../php/request.php?action=GetNavireRd&limit=${limitValue}&mmsi=${mmsiValue}`, displayNavireTableFiltered);
      }
    });
}


// Pagination et affichage filtré
function displayNavireTableFiltered(response) {
  navireData = response;  // Sauvegarde globale
  currentPage = 1;        // Remise à 1 pour nouvelle donnée
  renderTablePage();
  renderPagination();
}

function renderTablePage() {
  // Fonction pour afficher une page du tableau des navires
  let tbody = $('#tabletable_bateau tbody');
  tbody.empty();

  let start = (currentPage - 1) * rowsPerPage;
  let end = start + rowsPerPage;
  let pageData = navireData.slice(start, end);

  for (let i = 0; i < pageData.length; i++) {
    let boat = pageData[i];
    let row = `
      <tr data-index="${start + i}">
        <td>${boat.mmsi}</td>
        <td>${boat.basedatetime}</td>
        <td>${boat.lat}</td>
        <td>${boat.lon}</td>
        <td>${boat.sog}</td>
        <td>${boat.cog}</td>
        <td>${boat.heading}</td>
        <td>${boat.nom_bateau}</td>
        <td>${boat.vesselstatus}</td>
        <td>${boat.longueur}</td>
        <td>${boat.largeur}</td>
        <td>${boat.draft}</td>
        <td><input type="radio" name="Prediction-Type-Navire" class="predict-radio" data-index="${start + i}"></td>
      </tr>`;
    tbody.append(row);
  }

  plotAllBoatsOnMap(pageData);

  // Filtrage dynamique sur MMSI dans la page affichée
  $('#filterMMSI').off('input').on('input', function() {
    const filter = $(this).val().trim();

    $('#tabletable_bateau tbody tr').each(function() {
  
      const mmsiCell = $(this).find('td').eq(0).text().trim();

      if (mmsiCell.startsWith(filter) || filter === '') {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  // Gestion des boutons après affichage page
  $('#plotMapButton').off('click').click(() => {
    let selectedIndex = $("input[name='Prediction-Type-Navire']:checked").data('index');
    if (selectedIndex !== undefined) {
      // Trouve le bateau global
      plotSelectedBoatOnMap(navireData, selectedIndex);
    } else {
      plotAllBoatsOnMap(pageData);
    }
  });

  $('#predictButton').off('click').click(() => {
    // Fonction pour prédire le type de navire après avoir sélectionné un navire dans le tableau
    let selectedIndex = $("input[name='Prediction-Type-Navire']:checked").data('index');
    if (selectedIndex !== undefined) {
      //récupération des données du navire sélectionné
      const data = {
        mmsi: navireData[selectedIndex].mmsi,
        Length: navireData[selectedIndex].longueur,
        Width: navireData[selectedIndex].largeur,
        Draft: navireData[selectedIndex].draft
      };
      const queryString = new URLSearchParams(data).toString();
      ajaxRequest('POST', '../php/request.php?action=predictType', displayPredictPage, queryString);
    } else {
      alert("Veuillez sélectionner un navire pour la prédiction.");
    }
  });

  $('#positionButton').off('click').click(() => {
    // Fonction pour prédire la position d'un navire après avoir sélectionné un navire dans le tableau
    let selectedIndex = $("input[name='Prediction-Type-Navire']:checked").data('index');
    if (selectedIndex !== undefined) {
      let timeInput = prompt("Entrez le temps (en secondes) pour la prédiction de position :");
      let time_v = parseInt(timeInput);
      if (isNaN(time_v) || time_v <= 0) {
        alert("Veuillez entrer un nombre valide pour le temps.");
        return;
      }
      const boat = navireData[selectedIndex];
      //récupération des données du navire sélectionné
      // et envoi de la requête AJAX pour prédire la position
      const data = {
        mmsi: boat.mmsi,
        date: boat.basedatetime,
        length: boat.longueur,
        width: boat.largeur,
        draft: boat.draft,
        latitude: boat.lat,
        longitude: boat.lon,
        sog: boat.sog,
        cog: boat.cog,
        heading: boat.heading,
        time: time_v
      };
      const query = new URLSearchParams(data).toString();
      ajaxRequest('POST', `../php/request.php?action=predictposition`, displayPredictionPosition, query);
    } else {
      alert("Veuillez sélectionner un navire pour la prédiction.");
    } 
  });

  $('#clusterButton').off('click').click(() => {
    if (!navireData || navireData.length === 0) {
      alert("Aucun navire disponible pour le clustering.");
      return;
    }
    const clusterData = navireData.map(boat => ({
      mmsi: boat.mmsi,
      latitude: boat.lat,
      longitude: boat.lon,
      sog: boat.sog,
      cog: boat.cog,
      heading: boat.heading,
    }));
    const data_j = JSON.stringify(clusterData);
    ajaxRequest('POST','../php/request.php?action=predictclusters',displayClusterResults,data_j);
  });
}






function renderPagination() {
  //Fonction pour diviser le tableau en plusieurs pages
  const totalPages = Math.ceil(navireData.length / rowsPerPage);
  const pagination = $('#pagination');
  pagination.empty();

  if (totalPages <= 1) return;

  // Nombre maximum de boutons à afficher
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  // Ajuster si on est proche des bords
  if (currentPage <= 3) {
    endPage = Math.min(totalPages, maxPagesToShow);
  } else if (currentPage > totalPages - 3) {
    startPage = Math.max(1, totalPages - maxPagesToShow + 1);
  }

  // Bouton Précédent
  const prevDisabled = currentPage === 1 ? ' disabled' : '';
  pagination.append(`<li class="page-item${prevDisabled}"><a class="page-link" href="#" data-page="${currentPage - 1}">Précédent</a></li>`);

  // Si on est loin du début, afficher le 1 et "..."
  if (startPage > 1) {
    pagination.append(`<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`);
    if (startPage > 2) {
      pagination.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
    }
  }

  // Pages numérotées visibles
  for (let i = startPage; i <= endPage; i++) {
    const activeClass = i === currentPage ? ' active' : '';
    pagination.append(`<li class="page-item${activeClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
  }

  // Si on est loin de la fin, afficher "..." et la dernière page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pagination.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
    }
    pagination.append(`<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`);
  }

  // Bouton Suivant
  const nextDisabled = currentPage === totalPages ? ' disabled' : '';
  pagination.append(`<li class="page-item${nextDisabled}"><a class="page-link" href="#" data-page="${currentPage + 1}">Suivant</a></li>`);

  // Gestion des clics pagination
  $('.page-link').off('click').on('click', function(e) {
    e.preventDefault();
    const selectedPage = parseInt($(this).data('page'));
    if (!isNaN(selectedPage) && selectedPage >= 1 && selectedPage <= totalPages && selectedPage !== currentPage) {
      currentPage = selectedPage;
      renderTablePage();
      renderPagination();
    }
  });
}









function plotAllBoatsOnMap(response) {
  //Affichage des navires sur la carte
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
