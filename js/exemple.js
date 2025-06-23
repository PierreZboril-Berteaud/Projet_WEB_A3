function clearPage(){ // Permet de vider la page
  $('#Fonction1Page').html('');

  $('#chartContainer').hide();
  $('#errors').hide();
  
  let chartStatus = Chart.getChart("myChart"); // On récupère le graphique
  if (chartStatus != undefined) {
    //chartStatus.img.clear();
    chartStatus.destroy(); // On supprime le graphique
  }
}