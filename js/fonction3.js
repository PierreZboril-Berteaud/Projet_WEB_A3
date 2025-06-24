//si l'utilisateur clique sur le bouton, on fait une requête AJAX
$("#Fonction3").click(() => {
  ajaxRequest('GET', '../php/request.php?action=AfficheTableau', AfficherTableauNavire);
});


//fonction appelée après la réception des données des bateaux 
function AfficherTableauNavire(response){
    clearPage(); //vider le contenu principal

    let bateaux; //bateaux est un tableau
    
  /*  
    try {
        bateaux = JSON.parse(response); //convertit le JSON en tableau JS
    } catch (error){
        console.error("Erreur lors de l'analyse des données JSON :", error);
        $('TableauNavire').html("<p>Erreur : les données reçues sont invalides.</p>");
        return;
    }
    */

    if (response) {
        try {
             bateaux = JSON.parse(response); //convertit le JSON en tableau JS
        } catch (error){
            console.error("Erreur lors de l'analyse des données JSON :", error);
            $('TableauNavire').html("<p>Erreur : les données reçues sont invalides.</p>");
            return;
        }
    } else {
            console.error("La réponse est vide ou non définie.");
            $('#TableauNavire').html("<p>Erreur : la réponse est vide ou non définie.</p>");
    }




//tableau
  let html = `
    <img src="../images/Bateau_1.jpeg" alt="logo">
    <div id="infos-text" class="m-3">
      <p class="text-center">Bienvenue sur <b>Titre</b>...texte...</p>
      <div>
        <h4>Comment ça marche ?</h4>
        <p style="text-align: justify;">...texte...</p>
      </div>
      <div>
        <h4>Prediction</h4>
        <p class="text-justify">...texte...</p>
      </div>
    </div>


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
        <tbody>
        `;

/*
        if (bateaux.length === 0){ //on vérifie si le tableau "bateaux" est vide
            html += `<tr><td colspan="12">Aucun navire trouvé dans la base de données.</td></tr>`;
        
        } else { //le tableau contient des navires
*/



//si le tableau contient des navires 
        if (bateaux.length > 0) {
            bateaux.forEach(bateau => { //on parcourt chaque bateau
                html += `
                    <tr> //ajoute une ligne 
                //avec les $ on ajoute la valeur de chaque propriété du bateau
                        <td>${bateau.mmsi}</td> 
                        <td>$new Date(bateau.horodatage).toLocaleString()}</td>
                        <td>${bateau.latitude}</td>
                        <td>${bateau.longitude}</td>
                        <td>${bateau.sog}</td>
                        <td>${bateau.cog}</td>
                        <td>${bateau.cap_reel}</td>
                        <td>${bateau.nom}</td>
                        <td>${bateau.etat}</td>
                        <td>${bateau.longueur}</td>
                        <td>${bateau.largeur}</td>
                        <td>${bateau.tirant_eau}</td>
                    </tr>
                `;
            });
        }

        html += `</tbody></table>`; //on ferme le tableau

//affiche le tableau dans la page 
  $('#TableauNavire').html(html); //on met le contenu HTML dans la page avec l'ID TableauNavire
}