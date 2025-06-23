//$("#AjoutNavire").click(()=> {ajaxRequest('GET','php/request.php/ajoutNavire/',displayAjoutNavire)});

//$('#homePageButton').click(()=> {ajaxRequest('GET', 'php/request.php/home/', displayInfos)});

$("#AjoutNavire").click(() => {
  ajaxRequest('GET', '../php/request.php?action=ajoutNavire', displayAjoutNavire);
});

$('#homePageButton').click(() => {
  ajaxRequest('GET', '../php/request.php?action=home', displayInfos);
});

/*function displayAjoutNavire(){
    clearPage();
    let html=

    `<form>
    <label for="MMSI">MMSI :</label><input type="text" id="MMSI" name="MMSI" placeholder="MMSI 9 Chiffres" required />
    <label for="Date">Date :</label><input type="datetime-local" id="date" name="date" required>

    <label for="Latitude">Latitude :</label><input type="text" id="Latitude" name="Latitude" placeholder="Latitude entre 20 et 30" required />
    <label for="Longitude">Longitude :</label><input type="text" id="Longitude" name="Longitude" placeholder="Longitude entre -98 et -78" required />

    <label for="SOG">SOG :</label><input type="text" id="SOG" name="SOG" placeholder="SOG" required />
    <label for="COG">COG :</label><input type="text" id="COG" name="COG" placeholder="COG" required/>
    <label for="Heading">Heading :</label><input type="text" id="Heading" name="Heading" placeholder="Heading" required />

    <label for="Nom">Nom :</label><input type="text" id="Nom" name="Nom" placeholder="Nom" required />
    <label for="Etat">Etat :</label><input type="text" id="Etat" name="Etat" placeholder="Etat" required />

    <label for="Longueur">Longueur :</label><input type="text" id="Longueur" name="Longueur" placeholder="Longueur" required />
    <label for="Largeur">Largeur :</label><input type="text" id="Largeur" name="Largeur" placeholder="Largeur" required />
    <label for="TirantEau">Tirant d'eau :</label><input type="text" id="TirantEau" name="TirantEau" placeholder="Tirant d'eau" required />
    <div class="form-group row">
        <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
        <div class="col-sm-10">
        <input type="password" class="form-control" id="inputPassword" placeholder="Password">
    </div>
    <button type="submit" class="btn btn-primary mb-2">Confirm identity</button>


    </form>`
    $("#AjoutNavireForm").html(html)
}*/


function displayAjoutNavire(){
  clearPage();

  let html = `
  <form class="container p-4 shadow rounded bg-light" style="max-width: 700px; margin: auto;">
    <h3 class="text-center mb-4">Ajouter un Navire</h3>

    <div class="mb-3">
      <label for="MMSI" class="form-label">MMSI</label>
      <input type="text" class="form-control" id="MMSI" name="MMSI" placeholder="MMSI 9 chiffres" required>
    </div>

    <div class="mb-3">
      <label for="date" class="form-label">Date</label>
      <input type="datetime-local" class="form-control" id="date" name="date" required>
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
}
