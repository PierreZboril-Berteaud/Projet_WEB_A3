function displayPredictPage(response) {
    clearPage();



    let html = `
      <div class="card shadow-sm border-primary mb-4">
    <div class="card-header bg-primary text-white">
      <h2 class="h5 mb-0">Prédiction du Type de Navire</h2>
    </div>
    <div class="card-body">
      <p class="card-text">Le type de navire prédit est : <strong class="text-primary">${response}</strong></p>
    </div>
  </div>
    `;
    $("#prediction").html(html);
}


function displayPredictionPosition(response) {
    clearPage();
    console.log(response);
           

    let html = `
      <div id="card-prediction" class="card shadow-sm border-primary mb-4"style="max-width: 700px; max-height:1000px;margin: auto; padding-bottom: 60px;">
    <div class="card-header bg-primary text-white">
      <h2 class="h5 mb-0">Prédiction de la Position du Navire</h2>
    </div>
    <div class="card-body">
      <p class="card-text">La position prédite à la date ${response[2]} + ${minsec(response[3])}  du navire est :</p>
      <ul class="list-group">
      <li class="list-group-item">Latitude : <strong class="text-primary">${response[0]}</strong></li>
        <li class="list-group-item">Longitude : <strong class="text-primary">${response[1]}</strong></li>

      </ul>
    </div>
      <div id="map" style="height: 400px; width: 100%; margin-top: 15px;"></div>
  </div>

    `;

    $("#prediction").html(html);
    const lat = parseFloat(response[0]);
    const lon = parseFloat(response[1]);

    const lat_r = parseFloat(response[4]);
    const lon_r = parseFloat(response[5]);

    const map = L.map('map').setView([lat, lon], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup('Position prédite')
        .openPopup();

    L.marker([lat_r, lon_r]).addTo(map)
        .bindPopup('Position avant prédiction')
        .openPopup();
        
}

function minsec(data){
  if(data>60 && data <3600){
    return `${(data/60).toFixed(2)} minutes`
  }
  if(data>3600){
    return `${(data/3600).toFixed(2)} heures`
  }
  if(data < 60){
    return`${data} secondes`;
  }
}

