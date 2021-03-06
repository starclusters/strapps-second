// Initialize and add the map
var map;
// Create an infowindow object to use later
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: {lat: 41.94, lng: -87.88}
    // gestureHandling: 'greedy'
  });

  var markerIcon = {
    url: '/static/bridgeinfo/svg/markerIcon.svg',
    // url: 'http://zpkumar.pythonanywhere.com/BridgeIcon.svg',
    // size: new google.maps.Size(20, 32),
    // origin: new google.maps.Point(0, 0),
    // anchor: new google.maps.Point(0, 32)
  // size: new google.maps.Size(71, 71),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(70, 68),
  scaledSize: new google.maps.Size(135, 90)
  };

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(function(position) {
       var lat = position.coords.latitude;
       var lng =  position.coords.longitude;
      var devCenter = new google.maps.LatLng(lat, lng);
     map.setCenter(devCenter);
     map.setZoom(15);
   });

}

//   var customIcon = {
//     path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
//     fillColor: '#FF0000',
//     fillOpacity: .6,
//     anchor: new google.maps.Point(0,0),
//     strokeWeight: 0,
//     scale: 1
// }

var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.null,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
            drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
          },
          markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
          circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1,
            draggable: true
          },
          polygonOptions: {editable: true, draggable: true},
          polylineOptions: {editable: true, draggable: true},
          rectangleOptions: {editable: true, draggable: true},
          markerOptions: {draggable: true},
        });

drawingManager.setMap(map);

// map.data.setStyle({
//   icon: markerIcon,
//   // fillColor: 'green'
// });
  // NOTE: This uses cross-domain XHR, and may not work on older browsers.
  // var tollwayBridges = map.data.loadGeoJson(
  //     'tollway_bridge.geojson');

      var tollwayBridges = map.data.loadGeoJson('/static/bridgeinfo/data/tollway_bridge.geojson', null, function (features) {

        var markers = features.map(function (feature) {
            var g = feature.getGeometry();
            var marker = new google.maps.Marker({
              'position': g.get(0),
              icon: markerIcon,
              map: map
             });
            return marker;
        });

        var markerCluster = new MarkerClusterer(map, markers,{ imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
    });


  var infowindow = new google.maps.InfoWindow();
      /* Create a "listener" that will wait for the user to click an earthquake point,
     * and then display the infowindow with details about that earthquake.
     */
    map.data.addListener('click', function(event) {
      // in the geojson feature that was clicked, get the "place" and "mag" attributes
      // let name = event.feature.getProperty("NAME");
      // let SNumber = event.feature.getProperty("SN");
      let html = "";
      // html = "<table class="table table-striped"><tbody><tr><th scope="row">"+property+"</th><td>"+Value+"</td></tr></tbody></table>";
      event.feature.forEachProperty(function(value, property){
        // console.log(property, ':', value);
        html += "<p>"+property + " : " + value +"</p>";
      });

      // let html = name + ', SN ' + SNumber; // combine place and magnitude, inserting additional text between them
      infowindow.setContent('<div class="info-window-content">'+html+'</div>');
      infowindow.setPosition(event.feature.getGeometry().get()); // anchor the infowindow at the marker
      infowindow.setOptions({pixelOffset: new google.maps.Size(0,-30)}); // move the infowindow up slightly to the top of the marker icon
      infowindow.open(map);
    });
}
