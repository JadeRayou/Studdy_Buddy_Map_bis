var map = L.map('map').setView([48.866667, 2.333333], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var modal = document.querySelector('#laModale');
var inputNom = document.querySelector('#nom');
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

// fonction pour les boutons des filtres sur la modal
function returnMuseesOrAssociations(){
	if(document.getElementById('filterMusées').checked){
		var valeur = document.getElementById('filterMusées').value;
	} else { // si ce n'est pas l'un, c'est l'autre
		var valeur = document.getElementById('filterAssociations').value;
	}
	return valeur;
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
            coordonnée : coordonnée,
            valeur : returnMuseesOrAssociations(),
        });
        // Update local storage
        localStorage.setItem('savetableauMarker_v2', JSON.stringify(tableauMarker));
        ajouterMarker(inputNom.value,inputImage.value, inputInfo.value, coordonnée, valeur )
        // on vide les champs de la modale
        inputNom.value = "";
        inputImage.value = "";
        inputInfo.value = "";
    }
});

// on ajoute le marker sur la map avec le popup qui correspond
function ajouterMarker() {
    marker = new L.Marker([coord.lat, coord.lng],{ draggable: true }).addTo(map);
    marker.bindPopup("<strong>" + inputNom.value + "</strong><br><img src='" + inputImage.value + "'><br>" + inputInfo.value + "<br>" + "<button type='button' class='delete' onclick='supprimeMarker("+ coord.lat + ", " + coord.lng + ")'>suppr</button>");
}

// fonction pour déplacer le marker 
marker.on('dragend', function(event) {
    var marker = event.target;
    var position = marker.getLatLng();
    console.log(position);
   
});

// on charge les markers du localstorage
for (var i = 0; i < tableauMarker.length; i++) {
    ajoutMarkerSurLaMap(tableauMarker[i].titre, tableauMarker[i].image, tableauMarker[i].info, tableauMarker[i].coordonnée);
}

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