
$("#AjoutNavire").click(() => {
  ajaxRequest('GET', '../php/request.php?action=ajoutNavire', displayAjoutNavire);
});

$('#homePageButton').click(() => {
  ajaxRequest('GET', '../php/request.php?action=home', displayInfos);
});


function displayAjoutNavire(){
  clearPage();

  let html = `
  <form id="AjoutNavireForm_envoi" class="container p-4 shadow rounded bg-light" style="max-width: 700px; margin: auto; margin-bottom:10%;">
    <h3 class="text-center mb-4">Ajouter un Navire</h3>

    <div class="mb-3">
      <label for="MMSI" class="form-label">MMSI</label>
      <input type="text" class="form-control" id="MMSI" name="MMSI" placeholder="MMSI 9 chiffres" required>
    </div>

    <div class="mb-3">
        <label for="date" class="form-label">Date</label>
        <input type="datetime-local" class="form-control" id="date" name="date" step="1" required>
    </div>


    <div class="row mb-3">
      <div class="col">
        <label for="Latitude" class="form-label">Latitude</label>
        <input type="text" class="form-control" id="Latitude" name="Latitude" placeholder="entre 20 et 30" required>
      </div>
      <div class="col">
        <label for="Longitude" class="form-label">Longitude</label>
        <input type="text" class="form-control" id="Longitude" name="Longitude" placeholder="entre -98 et -78" required>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col">
        <label for="SOG" class="form-label">SOG</label>
        <input type="text" class="form-control" id="SOG" name="SOG" placeholder="Speed Over Ground" required>
      </div>
      <div class="col">
        <label for="COG" class="form-label">COG</label>
        <input type="text" class="form-control" id="COG" name="COG" placeholder="Course Over Ground" required>
      </div>
      <div class="col">
        <label for="Heading" class="form-label">Heading</label>
        <input type="text" class="form-control" id="Heading" name="Heading" placeholder="Heading" required>
      </div>
    </div>

    <div class="mb-3">
      <label for="Nom" class="form-label">Nom du navire</label>
      <input type="text" class="form-control" id="Nom" name="Nom" required>
    </div>

    <div class="mb-3">
      <label for="Etat" class="form-label">État</label>
      <input type="text" class="form-control" id="Etat" name="Etat" required>
    </div>

    <div class="row mb-3">
      <div class="col">
        <label for="Longueur" class="form-label">Longueur</label>
        <input type="text" class="form-control" id="Longueur" name="Longueur" required>
      </div>
      <div class="col">
        <label for="Largeur" class="form-label">Largeur</label>
        <input type="text" class="form-control" id="Largeur" name="Largeur" required>
      </div>
      <div class="col">
        <label for="TirantEau" class="form-label">Tirant d'eau</label>
        <input type="text" class="form-control" id="TirantEau" name="TirantEau" required>
      </div>
    </div>
    <div class="text-center">
      <button type="submit" class="btn btn-primary">Confirmer l'identité</button>
    </div>
  </form>`;

  $("#AjoutNavireForm").html(html);
   $('#AjoutNavireForm_envoi').submit((event)=> {
    event.preventDefault();

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

function addNavireResponse(){
  console.log("Navire ajouté avec succès");
}

