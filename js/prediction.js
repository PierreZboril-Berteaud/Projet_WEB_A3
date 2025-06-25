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
      <div class="card shadow-sm border-primary mb-4">
    <div class="card-header bg-primary text-white">
      <h2 class="h5 mb-0">Prédiction de la Position du Navire</h2>
    </div>
    <div class="card-body">
      <p class="card-text">La position prédite du navire est :</p>
      <ul class="list-group">
      <li class="list-group-item">Latitude : <strong class="text-primary">${response[0]}</strong></li>
        <li class="list-group-item">Longitude : <strong class="text-primary">${response[1]}</strong></li>
        <li class="list-group-item">Date : <strong class="text-primary">${response[2]}</strong></li>
      </ul>
    </div>
  </div>
    `;

    $("#prediction").html(html);
}