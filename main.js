var map = L.map('map').setView([48.866667, 2.333333], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var modal = document.querySelector('#laModale');
var inputTitre = document.querySelector('#titre');
var inputImage = document.querySelector('#image');
var inputInfo = document.querySelector('#info');
var filterMusées = document.querySelector('#filterMusées')
var filterAssociations = document.querySelector('filterAssociations');
var coordonnée;
var tableauMarker ;
var radios = document.getElementsByName('filterForMap');
var valeur;

try {
    // on essaye de recuperer le tableau dans le localstorage
    tableauMarker = JSON.parse(localStorage.getItem('savetableauMarker_v2')) || [];
}
catch (error) {
    // si ça ne fonctionne pas, on crée un tableau vide
    tableauMarker = [];
    // et on ne fait rien avec l'erreur
}

// on enregistre les coordonnées du click et on affiche la modale
function onMapClick(e) {
    coord = e.latlng;
    modal.showModal();
}
map.on('click', onMapClick);

// on enregistre les infos rentrées dans la modale sous forme d'objet pour chaque marker et on l'enregistre dans le localStorage
modal.addEventListener('close', function () {
    if (modal.returnValue === 'oui') {
        tableauMarker.push({
            titre : inputNom.value,
            image : inputImage.value,
            info : inputInfo.value,
            coordonnée : coord
        });
        // Update local storage
        localStorage.setItem('savetableauMarker_v2', JSON.stringify(tableauMarker));
        ajoutMarkerSurLaMap(inputTitre.value, inputImage.value, inputInfo.value, coordonnée);
        // on vide les champs de la modale
        inputNom.value = "";
        inputImage.value = "";
        inputInfo.value = "";
    }
});

// on ajoute le marker sur la map avec le popup qui correspond
function ajoutMarkerSurLaMap(titre, image, info, coordonnée) {
    // Icon options
    // var iconOptions = {
    //     iconUrl: 'images/komarov-egor-sYwDefjO7fI-unsplash.jpg',
    //     iconSize: [60, 50]
    // }
    // // Creating a custom icon
    // var customIcon = L.icon(iconOptions);
    var marker = new L.Marker([coordonnée.lat, coordonnée.lng],{ draggable: true }).addTo(map);
    marker.bindPopup(
        '<h2>' + titre + '</h2>'
        + '<p>' + info + '</p>'
        + '<img src="' + image + '" alt="' + titre + '"style="width:60px;height:50px;">'
        + '<p><a style="cursor: pointer" onclick="supprimeMarker('+ coordonnée.lat + ', ' + coordonnée.lng + ')">Supprimer</a></p>'
    
    );
}

// on charge les markers du localstorage
for (var i = 0; i < tableauMarker.length; i++) {
    ajoutMarkerSurLaMap(tableauMarker[i].titre, tableauMarker[i].image, tableauMarker[i].info, tableauMarker[i].coordonnée);
}

// fonction pour déplacer le marker 
marker.on('dragend', function(event) {
    var marker = event.target;
    var position = marker.getLatLng();
    console.log(position);
   
});

// supprimer un marker
function supprimeMarker(lat, lng) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            if (layer.getLatLng().lat === lat && layer.getLatLng().lng === lng) {
                map.removeLayer(layer);
            }
        }
    });
    tableauMarker = tableauMarker.filter(function (marker) {
        return marker.coordonnée.lat !== lat || marker.coordonnée.lng !== lng;
    });
    localStorage.setItem('savetableauMarker_v2', JSON.stringify(tableauMarker))
}