$("#AjoutNavire").click(() => {
  ajaxRequest('GET', '../php/request.php?action=ajoutNavire', displayAjoutNavire);
});





function displayAjoutNavire(){
  clearPage();
  let html = `
  <form id="AjoutNavireForm_envoi" class="container p-4 shadow rounded bg-light" style="max-width: 700px; margin: auto; margin-bottom:10%;">
    <h3 class="text-center mb-4">Ajouter un Navire</h3>

    <div class="mb-3">
      <label for="MMSI" class="form-label">MMSI</label>
      <input type="text" class="form-control" id="MMSI" name="MMSI" maxlength="9" minlength="9" placeholder="MMSI 9 chiffres" required>
    </div>

    <div class="mb-3">
        <label for="date" class="form-label">Date</label>
        <input type="datetime-local" class="form-control" id="date" name="date" step="1" required>
    </div>

    <div class="row mb-3">
      <div class="col">
        <label for="Latitude" class="form-label">Latitude</label>
        <input type="number" class="form-control" id="Latitude" min="20" max="30" name="Latitude" placeholder="entre 20 et 30" required>
      </div>
      <div class="col">
        <label for="Longitude" class="form-label">Longitude</label>
        <input type="number" class="form-control" id="Longitude" min="-98" max="-78" name="Longitude" placeholder="entre -98 et -78" required>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col">
        <label for="SOG" class="form-label">SOG</label>
        <input type="number" class="form-control" id="SOG" min="0" max="50" name="SOG" placeholder="Speed Over Ground" required>
      </div>
      <div class="col">
        <label for="COG" class="form-label">COG</label>
        <input type="number" class="form-control" id="COG" min="0" max="359" name="COG" placeholder="Course Over Ground" required>
      </div>
      <div class="col">
        <label for="Heading" class="form-label">Heading</label>
        <input type="number" class="form-control" id="Heading" min="0" max="359" name="Heading" placeholder="Heading" required>
      </div>
    </div>

    <div class="mb-3">
      <label for="Nom" class="form-label">Nom du navire</label>
      <input type="text" class="form-control" id="Nom" name="Nom" required>
    </div>

    <div class="mb-3">
      <label for="Etat" class="form-label">État</label>
      <input type="number" class="form-control" id="Etat" min="0" max="30" name="Etat" required>
    </div>

    <div class="row mb-3">
      <div class="col">
        <label for="Longueur" class="form-label">Longueur</label>
        <input type="number" class="form-control" id="Longueur" min="10" max="365" name="Longueur" required>
      </div>
      <div class="col">
        <label for="Largeur" class="form-label">Largeur</label>
        <input type="number" class="form-control" id="Largeur" min="3" max="124" name="Largeur" required>
      </div>
      <div class="col">
        <label for="TirantEau" class="form-label">Tirant d'eau</label>
        <input type="number" class="form-control" id="TirantEau" min="0.5" max="23" step="0.1" name="TirantEau" required>
      </div>
    </div>
    <div class="text-center">
      <button type="submit" class="btn btn-primary">Ajouter Le Navire</button>
    </div>
  </form>`;

  $("#AjoutNavireForm").html(html);
   $('#AjoutNavireForm_envoi').submit((event)=> {
    event.preventDefault();
    console.log($("#date").val())
    const data = {
      MMSI: $("#MMSI").val(),
      date: $("#date").val(),
      latitude: $("#Latitude").val(),
      longitude: $("#Longitude").val(),
      SOG: $("#SOG").val(),
      COG: $("#COG").val(),
      Heading: $("#Heading").val(),
      Nom: $("#Nom").val(),
      Etat: $("#Etat").val(),
      Longueur: $("#Longueur").val(),
      Largeur: $("#Largeur").val(),
      Draft: $("#TirantEau").val()
    };
    
    // Convertir l'objet data en une chaîne de requête
    const queryString = new URLSearchParams(data).toString();

    ajaxRequest('POST', '../php/request.php?action=ajoutNavireBdd',addNavireResponse,queryString);

  });
}

function addNavireResponse(response){
  if (response) {
    // Si la réponse contient un message de succès, l'afficher
    alert("Navire ajouté avec succès !");
    // Rediriger vers la page d'accueil ou une autre page si nécessaire
    ajaxRequest('GET', '../php/request.php?action=home', displayAjoutNavire);
  } else {
    // Si la réponse ne contient pas de succès, afficher un message d'erreur
    alert("Erreur lors de l'ajout du navire : ");
  }
}

