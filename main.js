var map = L.map('map').setView([48.866667, 2.333333], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var modal = document.querySelector('#laModale');
var inputNom = document.querySelector('#nom');
var inputImage = document.querySelector('#image');
var inputInfo = document.querySelector('#info');
var coord

function onMapClick(e) {
    modal.showModal();
    console.log(e.latlng);
    var marker = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    coord = e.latlng;
    marker.bindPopup("<strong>" + marker.titre + "</strong><br><img src='" + marker.image + "'><br>" + marker.info + "<br>" );
    // Add event listener to marker to allow deletion
    marker.on('dblclick', function(e) {
        map.removeLayer(marker);
        // Remove marker from the array
        tableauMarker = tableauMarker.filter(function(obj) {
            return obj.coordonée !== marker.getLatLng();
        });
        // Update local storage
        localStorage.setItem('savetableauMarker', JSON.stringify(tableauMarker));
    });
}

map.on('click', onMapClick);
modal.addEventListener('close', function () {
    console.log(modal.returnValue);
    if (modal.returnValue == 'oui') {
        ajoutMarker(inputNom.value, inputImage.value, inputInfo.value, coord);
    }
});

function ajoutMarker(w, x, y, z) {
    tableauMarker.push({
        titre : w,
        image : x,
        info : y,
        coordonée : z
    })
    console.log(tableauMarker);
    // Enregistre tableauMarker dans le localstorage avec le nom savetableauMarker
    localStorage.setItem('savetableauMarker', JSON.stringify(tableauMarker));
}

// Récupère le tableau de markers sauvegardé dans le localStorage
var tableauMarker = JSON.parse(localStorage.getItem('savetableauMarker')) || [];
var savedMarkers = localStorage.getItem('savetableauMarker');

if (savedMarkers) {
    savedMarkers = JSON.parse(savedMarkers);
    // Ajoute chaque marker à la carte
    tableauMarker.forEach(function(marker) {
        var newMarker = new L.marker(marker.coordonée).addTo(map);
        newMarker.bindPopup("<strong>" + marker.titre + "</strong><br><img src='" + marker.image + "'><br>" + marker.info + "<br>" );
    });
}
// var popup = L.popup();
// var photoImg = '<img src="https://static.pexels.com/photos/189349/pexels-photo-189349.jpeg" height="150px" width="150px"/>';
// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("<center>My Photo </center>" + "</br>"+ photoImg)
//         .openOn(map);
// }
// map.on('click', onMapClick);