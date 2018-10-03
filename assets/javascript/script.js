$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyBiqaBPPDQ81tqrLcrkt7GeMJYVL_WdEwE",
        authDomain: "andchill-55616.firebaseapp.com",
        databaseURL: "https://andchill-55616.firebaseio.com",
        projectId: "andchill-55616",
        storageBucket: "andchill-55616.appspot.com",
        messagingSenderId: "866283270828"
    };
    firebase.initializeApp(config);
    $("#food").hide();

    var database = firebase.database();

    database.ref().orderByChild("dateAdded").limitToLast(4).on("child_added", function (snapshot) {
        var recentname = snapshot.val().name;
        var recentImage = snapshot.val().Image;
        var recentFind = snapshot.val().FindOn;
        var recentMovies = "<div class='recentSearch col-lg-3 col-md-3 col-xs-6'>" + "<h4>" + recentname + "</h4><img src=" + recentImage + "><p>Find on: " + recentFind + "</p></div>";

        $("#recent").append(recentMovies);

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });


    $("#find-movie").on("click", function (event) {
        event.preventDefault();
        var movieSearch = $("#movie-input")
            .val()
            .trim();
        if (!movieSearch) return;
        var queryURL =
            "https://utelly-tv-shows-and-movies-availability-v1.p.mashape.com/lookup?";
        var queryString = queryURL + "country=" + "us" + "&term=" + movieSearch;
        getMovies(queryString);
    });

    function getMovies(queryURL) {
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET",
            headers: {
                "X-Mashape-Key": "dEFISQiTvwmshEJAWU2KwJRqazW0p1I0lb0jsn5LUpy7owpPJ6",
                Accept: "application/json"
            }
        }).success(function (response) {
            console.log(response);
            $('#recent').children().first().remove()
            $("#movies").empty();
            if ($.isArray(response.results) && response.results.length) {
                var html = buildHtml(response.results);
                $("#movies").append(html);
                addMoviesToFirebase(response.results);
            }
        });
    }

    function buildHtml(results) {
        var html = " <div class='row text-center text-lg-left'>";

        for (var i = 0; i < results.length; i++) {
            if (results[i].picture) {
                html = html + "<div class='currentSearch col-lg-3 col-md-4 col-xs-6'><h4>" + results[i].name + "</h4><img src=" + results[i].picture + "><p>Showing at: " +
                    getLocationsHtml(results[i].locations) + "</p></div>";
            } else {
                html = html + "<div class='currentSearch col-lg-3 col-md-4 col-xs-6'><h4>" + results[i].name + "</h4><p>Showing at: " +
                    getLocationsHtml(results[i].locations) + "</p></div>";
            }
        }
        html = html + "</div>";
        return html;
    }

    function getLocationsHtml(locations) {
        var html = "";
        for (var i = 0; i < locations.length; i++) {
            html =
                html +
                "<a  target='blank' href=" +
                locations[i].url +
                ">" +
                "<br>" +
                locations[i].display_name +
                "</a>";
        }
        return html;
    }

    function addMoviesToFirebase(results) {
        database.ref().push({
            name: results[0].name,
            FindOn: results[0].locations[0].display_name,
            Image: results[0].picture,
        });

    }
});

var geocoder,
    lat,
    long,
    zip;
navigator.geolocation.getCurrentPosition(
    function (position) {
        console.log(position);


        lat = position.coords.latitude;
        lng = position.coords.longitude;
        getZipCode(lat, lng);

        $("#find-movie").on("click", getFood);
    });


function initMap() {
    geocoder = new google.maps.Geocoder;
}

function getZipCode(lat, long) {
    var latlng = {
        lat: lat,
        lng: long
    };
    geocoder.geocode({
        'location': latlng
    }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                for (j = 0; j < results[0].address_components.length; j++) {
                    if (results[0].address_components[j].types[0] == 'postal_code') {
                        console.log("Zip Code: " + results[0].address_components[j].short_name);
                        zip = results[0].address_components[j].short_name;
                        return;
                    }
                }
            }
        }
    });
}

function getFood() {
    var queryGURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=AIzaSyDB8oKKFdugWo4hKPNthhL1ouMovHmJ_Is";
    $.ajax({
        url: queryGURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.results[4].address_components[0].long_name);

        var YqueryURL = "https://dl-yelp-help.herokuapp.com/yelp?zip=" + zip;

        $.ajax({
            url: YqueryURL,
            method: "GET"
        }).then(function (response) {
            $("#food").show();
            for (var i = 0; i < response.length; i++) {
                var html = ""
                html = html + "<div class='food'><div class='resturant takeout'>" + response[i].name + "</div>" + "<div class='takeout'>" + response[i].location.address1 + "</div>" + "<div class='takeout'>" + response[i].display_phone + "</div>" + "<div class='takeout'>" + response[i].price + "</div></div>"
                $("#restaurant").append(html);
            }
        });
    });
}
