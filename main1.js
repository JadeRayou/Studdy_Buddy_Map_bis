var map = L.map('map').setView([48.8694901, 2.3893574], 16);

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
    // on essaye de récupérer le tableau dans le localstorage
    tableauMarker = JSON.parse(localStorage.getItem('savetableauMarker_v2')) || [];
}
catch (error) {
    // si ça ne fonctionne pas, on crée un tableau vide
    tableauMarker = [];
    // et on ne fait rien avec l'erreur
}

function onMapClick(e) {
    coordonnée = e.latlng;
    modal.showModal();
};

map.on('click', onMapClick);

modal.addEventListener('close', function () {
    console.log(modal.returnValue)
    if (modal.returnValue === 'oui') {
        tableauMarker.push({
            titre: inputTitre.value,
            image: inputImage.value,
            info: inputInfo.value,
            coordonnée: coordonnée
        });
        localStorage.setItem('savetableauMarker_v2', JSON.stringify(tableauMarker));
        ajoutMarkerSurLaMap(inputTitre.value, inputImage.value, inputInfo.value, coordonnée);
        inputNom.value = "";
        inputImage.value = "";
        inputInfo.value = "";
    }
});

// on charge les marqueurs du localstorage
for (var i = 0; i < tableauMarker.length; i++) {
    ajoutMarkerSurLaMap(tableauMarker[i].titre, tableauMarker[i].image, tableauMarker[i].info, tableauMarker[i].coordonnée);
}

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
   

// fonction pour déplacer le marker 
marker.on('dragend', function(event) {
    var marker = event.target;
    var position = marker.getLatLng();
    console.log(position);
   
});

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
    localStorage.setItem('savetableauMarker_v2', JSON.stringify(tableauMarker));
}

// if (document.querySelector() == '#red') {
//     marker = {icon: redIcon};
// }