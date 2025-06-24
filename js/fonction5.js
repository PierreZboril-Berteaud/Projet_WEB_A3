
ajaxRequest('GET', '../php/request.php?action=home', displayInfos);

function clearPage(){ // Permet de vider la page
  $('#infos').html('');
}

function displayInfos() {
  clearPage();
  let html = `
    
  `;
  $('#infos').html(html);
}

