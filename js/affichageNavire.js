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
  console.log(response);
  
  let html = `
      <div class="mx-5"><table class="table table-striped table-hover border border-1 rounded">
      <thead style="background-color: #12769E; color: white; position: sticky; top:0px">
    <tr>
      <th scope="col">MMSI</th>
      <th scope="col">Date</th>
      <th scope="col">latitude</th>
      <th scope="col">longitude</th>
      <th scope="col">SOG</th>
      <th scope="col">COG</th>
      <th scope="col">Heading</th>
      <th scope="col">Nom</th>
      <th scope="col">Status</th>
      <th scope="col">Longueur</th>
      <th scope="col">Largeur</th>
      <th scope="col">Profondeur</th>
    </tr>
    </thead>
    <tbody>`; 
      $('#TableauNavire').html(html);

  if (response.length !== 0) {
  for (let i = 0; i < response.length; i++) {
    let row = `
      <tr>
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
      </tr>
    `;
    $("table.container").append(row);
    }
  }
}