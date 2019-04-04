// Link to GeoJSON
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Grab data 
d3.json(APILink, function (data) {
    //console.log(data);
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function getColor(d) {
        return d > 7 ? '#800026' :
            d > 6 ? '#BD0026' :
                d > 5 ? '#E31A1C' :
                    d > 4 ? '#FC4E2A' :
                        d > 3 ? '#FD8D3C' :
                            d > 2 ? '#FEB24C' :
                                d > 1 ? '#FED976' :
                                    '#FFEDA0';
    };
    var earthquake = L.geoJSON(earthquakeData, {
        // Define a function we want to run once for each feature in the features array
        // popup  place and time of the earthquake
        onEachFeature: function (feature, layer) {

            layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>")
        }, pointToLayer: function (feature, latlng) {
            return new L.circleMarker(latlng,
                {
                    radius: 5*feature.properties.mag,
                    fillColor: getColor(feature.properties.mag),
                    fillOpacity: 1,
                    stroke: false,
                })
        }
    });



    createMap(earthquake);
}
function createMap(earthquake) {

    // Adding tile layer
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Adding tile layer
    var satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satMap",
        accessToken: API_KEY
    });

    // base object 
    var baseMaps = {
        "dark map": darkmap,
        "satelite map": satMap
    };
    // overlay opject 
    var overlayMap = {
        Earthquakes: earthquake
    };
    //base and overlay maps in one control layer
    // L.control.layer(baseMaps, overlayMap, {
    //     collapsed: false
    // }).addTo(myMap);

    // Creating map object
    var myMap = L.map("map", {
        center: [40.7128, -74.0059],
        zoom: 5,
        layers: [darkmap, earthquake]
    });


    var geojson;

    createMap(earthquake);


    // function createFeatures(earthquakeData) {

    //     var earthquake = L.geoJSON(earthquakeData, {
    //         // Define a function we want to run once for each feature in the features array
    //         // popup  place and time of the earthquake
    //         onEachFeature: function (feature, layer) {

    //             layer.bindPopup("<h3>" + feature.properties.place +
    //                 "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>")
    //         }, pointToLayer: function (feature, latlng) {
    //             return new L.circle(latlng,
    //                 {
    //                     radius: markerSize(feature.properties.mag),
    //                     fillColor: markerColor(feature.properties.mag),
    //                     fillOpacity: 1,
    //                     stroke: false,
    //                 })
    //         }
    //     });


        // Set up the legend
        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function () {
            var div = L.DomUtil.create("div", "info legend")
            magnitudes = [0, 1, 2, 3, 4, 5];

            // loop through our density intervals and generate a label with a colored square for each interval https://leafletjs.com/examples/choropleth/
            for (var i = 0; i < magnitudes.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
                    magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : '+');
            }

            return div;
        };

        legend.addTo(myMap);

        function getColor(d) {
            return d > 7 ? '#800026' :
                d > 6 ? '#BD0026' :
                    d > 5 ? '#E31A1C' :
                        d > 4 ? '#FC4E2A' :
                            d > 3 ? '#FD8D3C' :
                                d > 2 ? '#FEB24C' :
                                    d > 1 ? '#FED976' :
                                        '#FFEDA0';
        };
        createMap(earthquake);
    };



