
ajaxRequest('GET', '../php/request.php?action=home', displayInfos);

$('#Accueil').click(() => {
  ajaxRequest('GET', '../php/request.php?action=home', displayInfos);
});

function clearPage(){ 
  $('#infos').html('');
  $("#AjoutNavireForm").html('');
  $('#TableauNavire').html('');
  $('#prediction').html('');
  $('#map').html('');
  var div = document.getElementById('map2');
  if (div) {
      div.remove();
  }
}

function displayInfos() {
  clearPage();

  console.log("Displaying Info");
  let html = `
    <div id="infos-container">

      <div id="infos-text">
        <p class="welcome">Projet Big Data/ IA/ WEB </p>
        <h4>Analyse et Modélisation des Comportements de Navigation des Navires à partir des Données AIS</h4>
        <p class="description">
          Le golfe du Mexique, vaste étendue d eau bordée par les Etats-Unis, le Mexique et Cuba est un carrefour pour le commerce maritime international. Les navires qui le traversent jouent un rôle crucial dans l économie mondiale, transportant des marchandises allant du pétrole et du gaz naturel aux produits manufacturés, reliant ainsi les ports majeurs du continent américain. 
          A travers ce site, vous pourrez alors ajouter un bateau en rentrant certaines de ses informations, mais aussi visualiser tous les bateaux de la base de données web dans un tableau et sur une carte afin de voir leur trajectoire. De plus, il est également possible de prédire les clusters d appartenance, le type et la trajectoire des bateaux entrés dans la base de données web.  
        </p>   
      </div>
    </div>
    


    <img src="../images/Bateau_1.jpeg" alt="logo" id="infos-image">

        <div class="carousel-container">
          <div id="carousel-title" style="text-align:center; font-weight:700; margin-bottom: 8px; color:#12769E; font-size:1.2rem;">
            Navire cargo
        </div>
          <button class="carousel-btn prev">&#10094;</button>
          <div class="carousel">
            <img src="../images/Bateau_2.jpg" class="carousel-img active" alt="Bateau 2"data-title="Navire cargo">
            <img src="../images/Bateau_3.jpg" class="carousel-img" alt="Bateau 3"data-title="Pétrolier">
            <img src="../images/Bateau_4.jpeg" class="carousel-img" alt="Bateau 4"data-title="Bateau de pêche">
          </div>
          <button class="carousel-btn next">&#10095;</button>
        </div>
      `;

      $('#infos').html(html);




  // Carrousel JS
  let current = 0;
  const images = document.querySelectorAll(".carousel-img");
  const total = images.length;
  const titleElement = document.getElementById("carousel-title");

  function updateCarousel(index) {
    images.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });
    titleElement.textContent = images[index].dataset.title;
    current = index;
  }


  document.querySelector(".prev").addEventListener("click", () => {
    let newIndex = (current - 1 + total) % total;
    updateCarousel(newIndex);
  });


  document.querySelector(".next").addEventListener("click", () => {
    let newIndex = (current + 1) % total;
    updateCarousel(newIndex);
  });
   updateCarousel(0);
}