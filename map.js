var Gmap = {
  map: null,
  markers: [],
  stylesArray: [{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},{"stylers":[{"saturation":-17},{"gamma":0.36}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]}],

  initialize: function() {
    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(37.76860235297176, -122.45325604248048),
      styles: this.stylesArray
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions); 
  },

  addPlaceMarker: function(location) {
    var marker = new google.maps.Marker({
      position: location,
      icon:'img/black100.png',
      map: this.map
    });
    this.map.setCenter(location)
    this.map.setZoom(15)
  this.markers.push(marker);
},

setAllBounds: function (map) {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < this.markers.length; i++) {
    bounds.extend(this.markers[i].getPosition());
  }
  Gmap.map.fitBounds(bounds)
},


setAllMap: function (map) {
  for (var i = 0; i < this. markers.length; i++) {
    this.markers[i].setMap(map);
  }
},

clearMarkers: function () {
  this.setAllMap(null);
  this.markers = []
},

assignAutoComplete: function(){
  var autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')),{ types: ['geocode'] });
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    Gmap.goToAddress(autocomplete);
  });
},

goToAddress: function(autocomplete){
  var place = autocomplete.getPlace();
  var location = place.geometry.location
  Gmap.clearMarkers();
  Gmap.addPlaceMarker(location)
  $('#lat').val(location.lat())
  $('#lng').val(location.lng())
}







}
