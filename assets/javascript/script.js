$("#find-movie").on("click", function(event) {
console.log("you suck");
    // event.preventDefault() can be used to prevent an event's default behavior.
    // Here, it prevents the submit button from trying to submit a form when clicked
    event.preventDefault();

    // Here we grab the text from the input box
    var movie = $("#movie-input").val();

    // Here we construct our URL
    var queryURL = "https://utelly-tv-shows-and-movies-availability-v1.p.mashape.com/lookup?";



var param = $.param({
'term': movie,
'country': 'us',
})
    // Write code between the dashes below to hit the queryURL with $ajax, then take the response data
    // and display it in the div with an id of movie-view

    // ------YOUR CODE GOES IN THESE DASHES. DO NOT MANUALLY EDIT THE HTML ABOVE.

    $.ajax({
      url: queryURL + param,
      method: "GET",
      headers:{'X-Mashape-Key': 'dEFISQiTvwmshEJAWU2KwJRqazW0p1I0lb0jsn5LUpy7owpPJ6',
          Accept:'application/json'}

    }).then(function(response) {
      $("#movie-view").text(JSON.stringify(response));
      console.log(response);
    });

    // -----------------------------------------------------------------------

  });