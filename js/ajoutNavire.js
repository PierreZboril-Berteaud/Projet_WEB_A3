//$("#AjoutNavire").click(()=> {ajaxRequest('GET','php/request.php/ajoutNavire/',displayAjoutNavire)});

//$('#homePageButton').click(()=> {ajaxRequest('GET', 'php/request.php/home/', displayInfos)});

$("#AjoutNavire").click(() => {
  ajaxRequest('GET', '../php/request.php?action=ajoutNavire', displayAjoutNavire);
});

$('#homePageButton').click(() => {
  ajaxRequest('GET', '../php/request.php?action=home', displayInfos);
});

function displayAjoutNavire(){
    console.log('hello')
    clearPage();
    $('#infos').html('');
}