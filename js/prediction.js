
ajaxRequest('GET', '../php/request.php?action=home', displayInfos);

function clearPage() {
    $('#infos').html('');
}

function displayInfos() {
    clearPage();
    let html = `

  `;
    $('#infos').html(html);
}


