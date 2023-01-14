
// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Where: ${feature.properties.place}</h3><hr><p>Time:  ${new Date(feature.properties.time)}</p><hr>
    <p>Magnitude: ${feature.properties.mag}</p><hr><p>Number of "Felt" Reports: ${feature.properties.felt}`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.

  function createCircleMarker(feature, latlng) {
    let options = {
      radius: feature.properties.mag * 5,
      fillColor: getColor(feature.properties.mag),
      color: getColor(feature.properties.mag),
      weight: 0.5,
      opacity: 1,
      fillOpacity: 1
    }
    return L.circleMarker(latlng, options);
  }
  // Create a variable to latlng, each feature for popup, and cicrle radius/color/weight/opacity
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);

}


// set different color for different magnitude
function getColor(magnitude) {
  switch (true) {
    case magnitude >= 90:
      return "#ea2c2c";
    case magnitude >= 70:
      return "#ea822c";
    case magnitude >= 50:
      return "#ee9c00";
    case magnitude >= 30:
      return  "#eecc00";
    case magnitude >= 10:
      return "#d4ee00";
    default:
      return "#98ee00";
  }
}





// Create map
function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  // L.control.layers(baseMaps, overlayMaps, {
  //   collapsed: false
  // }).addTo(myMap);
  // adds legend to map
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var limits = [-10, 10, 30, 50, 70, 90];
    var labels = []
    // div.innerHTML += "<h4 style='margin:5px'>depth</h4>"
    // div.innerHTML += '<i class="circleR" style=background:>' + '</i>' + "Recent" + '<br>'

    // // loop through color intervals and generate a lable
    // for (var i = 0; i < magnitudes.length; i++) {
    //   div.innerHTML +=
    //     '<i class="circle" style=background:' + getColor(depth[i] + 1) + '></i>' +
    //     depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    // }

    // div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
    // <div class="max">' + limits[limits.length - 1] + '</div></div>'

    // limits.forEach(function (limit, index) {
    //   labels.push('<li style="background-color: ' + getColor(limit) + '"></li>')
    // })

    // div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    // return div;
    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < limits.length; i++) {
      console.log(limits[i],getColor(limits[i]))
      div.innerHTML += "<i style='background: " + getColor(limits[i]) + "'></i> "
        + limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
    }
    return div;

  };
  legend.addTo(myMap);
  // / toggles legend on and off
  // var legendLink = document.getElementById("legend");
  // legendLink.addEventListener('click', openLegend);
  // function openLegend() {
  //   document.getElementByClass("legend").style.display = 'block';
  // }


}
