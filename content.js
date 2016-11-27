// On page load (of G Movies), add a box with IMDB rating (for now),
// which also links to the IMDB page.

// 1. Grab all movie title strings
// 2. Loop through each title and query the rating
// 3. When the rating arrives, add a new DOM element next to the movie title
// with the rating and a link to the movie on IMDB

function movieTimesDisplayed() {
  return $('span.vk_bk.lr_c_h');
}

function allMovieTitleLinks() {
  return $('a.vk_bk.lr-s-din');
}

function getMovieRating(title) {
  console.log('Getting rating for ' + title + ' ...');
  return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', "https://www.omdbapi.com/?t="+title);
      xhr.onload = resolve;
      xhr.onerror = reject;
      xhr.send();
  });
}

function addMovieRatings() {
  console.log("Loading movie times.")
  allMovieTitleLinks().each(function() {
  var movieLink = this;
  var movieTitle = this.innerHTML;
  getMovieRating(movieTitle)
    .then(function(e) {
      var json = JSON.parse(e.target.response);
      var imdbLink = "http://www.imdb.com/title/" + json.imdbID + "/";
      var imdbRating = json.Response == "False" ? "N/A" : json.imdbRating;
      console.log('Adding in rating for ' + json.Title);
      // IMDB Rating
      $(movieLink).parents('.lr_c_tmt').append('<span style="padding-left: 5px;">(<span style="font-weight: bold; font-size:">' + json.imdbRating + '</span> on<a style="font-weight: bold; padding-left: 5px; text-decoration: none;" href="' + imdbLink + '" target="_blank">IMDB</a>)</span>');
      // Plot
      $(movieLink).parents('.lr_c_tmt').append('<div style="font-size: 13px; color: grey;">' + json.Plot + '</div>')
      // Year
      $(movieLink).parents('.lr_c_tmt').append('<div style="font-size: 11px; color: grey;">Year: ' + json.Year + '</div>')
      // Genre
      $(movieLink).parents('.lr_c_tmt').append('<div style="font-size: 11px; color: grey;">Genre: ' + json.Genre + '</div>')

    })
  })
}

function isMoviesView() {
  return $('span._U3c').length == 0;
}

function isTheatersView() {
  return $('span._U3c').length > 0;
}

function checkMovieBox() {
  console.log('Checking if movie times are loaded.')
  if ($('span.vk_bk.lr_c_h') && $('span.vk_bk.lr_c_h').length > 0 && isMoviesView()) {
    clearInterval(myListingsTimer);
    addMovieRatings();
  }
  if (isTheatersView()) {
    console.log("Theater view. No movie times will be loaded.")
    clearInterval(myListingsTimer);
  }
}

myListingsTimer = setInterval( checkMovieBox, 100 );

