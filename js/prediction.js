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
