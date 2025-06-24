$('#clusters').click(() => {
  ajaxRequest('GET', '../php/request.php?action=PageClusters', displayPageClusters);
});


function displayPageClusters(){
    clearPage();
}