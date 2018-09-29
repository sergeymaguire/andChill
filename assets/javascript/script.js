$("#find-movie").on("click", function (event) {

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
 
    event.preventDefault();
 
    var movie = $("#movie-input").val();
    if (!movie) return;
 
    var queryURL = "https://utelly-tv-shows-and-movies-availability-v1.p.mashape.com/lookup?";
 
    var queryString = queryURL + "country=" + "uk" + "&term=" + movie;
    getMovies(queryString);
 
    // -----------------------------------------------------------------------
 
 });
 
 function getMovies(queryURL) {
    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
            'X-Mashape-Key': 'dEFISQiTvwmshEJAWU2KwJRqazW0p1I0lb0jsn5LUpy7owpPJ6',
            Accept: 'application/json'
        }
    }).then(function (response) {
        if ($.isArray(response.results) && response.results.length) {
            var html = buildHtml(response.results);
            $("#movies").empty();
            $("#movies").append(html);
        };
    });
 };
 
 function buildHtml(results) {
    var html = "<ul>";
    for (var i = 0; i < results.length; i++) {
        html = html + "<li>" + "<img src='" + results[i].picture + "'></li>";
    };
    html = html + "</ul>";
    return html;
 }