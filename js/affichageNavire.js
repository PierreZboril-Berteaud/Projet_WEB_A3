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
      <h3> Liste des bateaux </h3>
      <table class="container">
          <thead>
              <tr>
                  <th>MMSI</th>
                  <th>Horodatage</th>
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
              </tr>
          </thead>
          </table>
          `; 
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