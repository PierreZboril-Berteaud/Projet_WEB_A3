
ajaxRequest('GET', '../php/request.php/home/', displayInfos);

function clearPage(){ // Permet de vider la page
  $('#infos').html('');

}

function displayInfos() // Affiche les informations de la page d'accueil
{
  
  
  clearPage();
  let html = `<img src="ressources/logoSite.png" alt="logo">
  <div id="infos-text" class="m-3">
  <p class="text-center">Bienvenue sur <b>DivePlanner</b>, l'application qui vous permet de planifier vos plongées en toute sécurité.</p>
  <div>
  <h4>Comment ça marche ?</h4>
  <p style="text-align: justify;">Il vous suffira de remplir un formulaire en fournissant le temps de votre plongée ainsi que la profondeur. Le résultat de cette recherche vous permettra d'acceder à un tableau avec toutes les informations utiles pour que votre plongée se passe sans problème. </p>
  </div>
  <div>
  <h4>Qu'est-ce qu'un profil ?</h4>
  <p class="text-justify">Un profil est constitué de 6 grandes parties pour chaque temps (t0 à tX). Vous retrouverez la profondeur, le temps, la pression ambiante, la consommation et enfin le bar et le volume restants. Vous aurez l'occasion de visualiser ces données sous forme de tableau et de graphique.</p>
  </div>
  </div>`;
  $('#infos').html(html);
  
}

//$('#homePageButton').click(()=> {ajaxRequest('GET', 'php/request.php/home/', displayInfos)});