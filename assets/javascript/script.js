//Step 1. geocoder is loaded in initMap function, to be used later to get the zip or nearest zip code of the current user
//Step 2. gets the current lat and long with the built in navigator(the browser object) function
//Step 3. get the first zip code found in the nearby locations of the current user
//Put on global level to be used later in function(Get zip code)
//This is called from the index.html script link

function getZipCode(geocoder, lat, long) {
  var latlng = {
    lat: lat,
    lng: long
  };
  showLoading();
  //geocoder = new google.maps.Geocoder();
  geocoder.geocode(
    //uses the global geocoder variable object
    {
      location: latlng
    },
    function(results, status) {
      if (status === "OK") {
        if (results[0]) {
          for (j = 0; j < results[0].address_components.length; j++) {
            if (results[0].address_components[j].types[0] == "postal_code") {
              zip = results[0].address_components[j].short_name;
              //above is waiting for the zipcode to return before setting up the click events
              zipCodeReady();
            }
          }
        }
      }
      hideLoading();
    }
  );
}

function initMap() {
  var geocoder = new google.maps.Geocoder(); // sets geocoder
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position);
    lat = position.coords.latitude; // sets global lat variable used in getzipcode function
    lng = position.coords.longitude; //sets global long variable used in getzipcode function
    getZipCode(geocoder, lat, lng);
  });
}
var lat, long, zip; //these are set and used
//Step 2. gets the current lat and long with the built in navigator(the browser object) function
//$(document).ready(function() {

var config = {
  apiKey: "AIzaSyBXh_OSGPOTI4ZxdxcJL5dcV3oByDTTVwc",
  authDomain: "andchill-eb480.firebaseapp.com",
  databaseURL: "https://andchill-eb480.firebaseio.com",
  projectId: "andchill-eb480",
  storageBucket: "andchill-eb480.appspot.com",
  messagingSenderId: "198184378958"
};
firebase.initializeApp(config);
var database = firebase.database();

function addMoviesToFirebase(results) {
  for (var i = 0; i < results.length; i++) {
    database.ref().push({
      name: results[i].name,
      FindOn: results[i].locations[0].display_name,
      Image: results[i].picture
    });
  }
}
function addRecentSearch() {
  database
    .ref()
    .orderByChild("dateAdded")
    .limitToLast(4)
    .on(
      "child_added",
      function(snapshot) {
        var recentname = snapshot.val().name;
        var recentImage = snapshot.val().Image;
        var recentFind = snapshot.val().FindOn;
        var recentMovies = "";
        if (recentImage) {
          recentMovies =
            "<div class='recentSearch col-lg-3 col-md-3 col-xs-6'>" +
            "<h4>" +
            recentname +
            "</h4><img src=" +
            recentImage +
            "><p>Find on: " +
            recentFind +
            "</p></div>";
        } else {
          recentMovies =
            "<div class='recentSearch col-lg-3 col-md-3 col-xs-6'>" +
            "<h4>" +
            recentname +
            "</h4>Find on: " +
            recentFind +
            "</p></div>";
        }
        $("#recent").append(recentMovies);
      },
      function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      }
    );
}

addRecentSearch(); //Show list of last four movies above
$("#food").hide();

function zipCodeReady() {
  // used this instead of a d
  $("#find-movie").on("click", getRestaurantsFromYelp); //going to call getfood function on the click event
  $("#find-movie").on("click", movieSearch); //Can not execute these until the zip code is returned in the above function where zipCodeReady() is being called.

  function movieSearch(event) {
    var movieSearch = $("#movie-input")
      .val()
      .trim();

    event.preventDefault();

    if (!movieSearch) return;
    var queryURL =
      "https://utelly-tv-shows-and-movies-availability-v1.p.mashape.com/lookup?";
    var queryString = queryURL + "country=" + "us" + "&term=" + movieSearch;
    getMovies(queryString);
  }

  function getMovies(queryURL) {
    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET",
      headers: {
        "X-Mashape-Key": "dEFISQiTvwmshEJAWU2KwJRqazW0p1I0lb0jsn5LUpy7owpPJ6",
        Accept: "application/json"
      }
    }).success(function(response) {
      console.log(response);
      $("#movies").empty();
      if ($.isArray(response.results) && response.results.length) {
        var html = buildMovieHtml(response.results);
        $("#movies").append(html);
        addMoviesToFirebase(response.results);
        $("#recent").empty();
        addRecentSearch(); //add the newest searched movie to the recent div
      }
    });
  }

  function buildMovieHtml(results) {
    var html = " <div class='row text-center text-lg-left'>";

    for (var i = 0; i < results.length; i++) {
      if (results[i].picture) {
        html =
          html +
          "<div class='col-lg-3 col-md-4 col-xs-6'>" +
          "<img src='" +
          results[i].picture +
          "'><div>" +
          results[i].name +
          "</div>Showing at: " +
          getLocationsHtml(results[i].locations) +
          "</div>";
      } else {
        html =
          html +
          "<div class='col-lg-3 col-md-4 col-xs-6'>" +
          "<div>" +
          results[i].name +
          "</div>Showing at: " +
          getLocationsHtml(results[i].locations) +
          "</div>";
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

  function getRestaurantsFromYelp() {
    if (!zip) {
      alert("No zip code");
      return;
    }
    var queryGURL =
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      lat +
      "," +
      lng +
      "&key=AIzaSyDB8oKKFdugWo4hKPNthhL1ouMovHmJ_Is";
    showLoading();
    $.ajax({
      url: queryGURL,
      method: "GET"
    }).then(function(response) {
      console.log(response.results[4].address_components[0].long_name);
      var YqueryURL = "https://dl-yelp-help.herokuapp.com/yelp?zip=" + zip;
      $.ajax({
        url: YqueryURL,
        method: "GET"
      }).then(function(response) {
        for (var i = 0; i < response.length; i++) {
          var html = "";
          html =
            html +
            "<p id='name'>" +
            response[i].name +
            "</p>" +
            "<p id='address'>" +
            response[i].location.address1 +
            "</p>" +
            "<p id='phone'>" +
            response[i].display_phone +
            "</p>" +
            "<p id='price'>" +
            response[i].price +
            "</p>";
          $("#restaurant").append(html);
        }
        hideLoading();
      });
    });
  }
  //});
}

function showLoading() {
  //shows the loading icon when waiting for movies or restaurants to return
  $(".loader").show();
}
function hideLoading() {
  //hides the loading icon when the movies or restaurants return
  $(".loader").hide();
}
