const userForm = document.querySelector("#user-form");
const lyricSearch = document.querySelector("#search-terms");

const topResultCard = document.querySelector("#first-result");
const songName = document.querySelector("#song-name");
const artistName = document.querySelector("#artist-name");

const seatgeekLink = document.querySelector("#seatgeek-link");
const lyricScroll = document.querySelector("#lyric-snippet");




var formSubmitHandler = function (event) {
  event.preventDefault();

  var searchTerms = lyricSearch.value;

  // If valid search terms are entered, clear all the info text before making queries.
  if (searchTerms) {
    songName.innerHTML = "";
    artistName.innerHTML = "";
    lyricScroll.innerHTML = "";
    seatgeekLink.innerHTML = "";

    queryLyrics(searchTerms);

    lyricSearch.value = "";
  } else {
    return;
  }
};




const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "de19aa5cf7msh73ad2831c334120p1ea066jsnd0b0feb55b4a",
    "X-RapidAPI-Host": "shazam.p.rapidapi.com",
  },
};

// TODO
// ---maybe do---
// Occasionally shazam's top result will be a remix. I think the easiest solution is to have more results display, to make it more likely the original song will at least be visible.

var queryLyrics = function (searchTerms) {
  console.log(searchTerms);

  fetch(
    "https://shazam.p.rapidapi.com/search?term=" +
      searchTerms +
      "&locale=en-US&offset=0&limit=5",
    options
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {

        // displaying song and artist
        currentSongName = data.tracks.hits[0].track.title;
        songName.innerHTML = currentSongName;
        currentArtistName = data.tracks.hits[0].track.subtitle;
        artistName.innerHTML = currentArtistName;

        // display snippet if available
        if (data.tracks.hits[0].snippet) {
          lyricScroll.innerHTML = '"' + data.tracks.hits[0].snippet + '"';
        } else {
          lyricScroll.innerHTML = "No lyric snippet available     :(";
        }

        // setting cover art as background image
        artistImage = data.tracks.hits[0].track.images.coverart;
        topResultCard.style.backgroundRepeat = "no-repeat";
        topResultCard.style.backgroundSize = "fill";
        topResultCard.style.backgroundImage = "url('" + artistImage + "')";

        // send artist name to seatgeek to query upcoming events.
        // replace method removes special characters, to prevent making the seatgeek url all gummed up.
        querySeatgeek(currentArtistName.replace(/[^a-z0-9,. ]/gi, ""));
        storeRecentQuery(currentArtistName, currentSongName, searchTerms);
      });
    }
  });
};





var querySeatgeek = function (currentArtistName) {
  var clientId = "Mjk0MDgzNjF8MTY2NDQxODE0Mi4zNTAzNjUy";
  seatgeekApiUrl =
    "https://api.seatgeek.com/2/events?performers.slug=" +
    currentArtistName +
    "&client_id=" +
    clientId;

  fetch(seatgeekApiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // console.log(data);

        // determines response based on whether or not there are any known events.
        if (data.events.length === 0) {
          seatgeekLink.removeAttribute("href");
          seatgeekLink.innerHTML = "No upcoming events    :(";
        } else {
          seatgeekLink.href = data.events[0].url;
          venueName = data.events[0].venue.name;
          eventLocation = data.events[0].venue.display_location;
          seatgeekLink.innerHTML =
            "Tickets available at " + venueName + " in " + eventLocation;
        }
      });
    } else {
      console.log("WHOOPS--- Seatgeek did a bad.");
    }
  });
};



var dataArray = [];
const mostRecent = document.querySelector("#most-recent");
const nextRecent = document.querySelector("#next-recent");
const lastRecent = document.querySelector("#last-recent");
const allRecentBtns = document.querySelector(".recent-btn");



var storeRecentQuery = function (
  currentArtistName,
  currentSongName,
  searchTerms
) {
  var searchData = {
    Artist: currentArtistName,
    Song: currentSongName,
    Terms: searchTerms,
  };

  // This monstrosity prevents changes to the recent buttons if you click on one of them (prevents repeats)
  //It does not prevent repeats if you enter the same search terms but one or two charactrers off, or a different line of lyrics from the same song.
  if (!dataArray) dataArray = [];

  if (
    (!!dataArray[0] && searchData.Terms == dataArray[0].Terms) ||
    (!!dataArray[1] && searchData.Terms == dataArray[1].Terms) ||
    (!!dataArray[2] && searchData.Terms == dataArray[2].Terms)
  ) {
    return;
  } else {
    //This limits the array size to three, for three recent searches. It puts the latest search at the front of the array.
    dataArray.unshift(searchData);
    if (dataArray.length > 3) {
      dataArray.pop();
    }

    localStorage.setItem("recentSearches", JSON.stringify(dataArray));
    init();
  }
};





// this function is populating the recent search buttons the way I want, but looks ridiculous. Currently unable (unwilling) to figure out a for loop setup.
var init = function () {
  dataArray = JSON.parse(localStorage.getItem("recentSearches"));

  console.log(dataArray);

  if (!dataArray) return;

  //these three if statements populate the recent buttons. It used to be way longer and uglier.
  if (dataArray[0]) {
    mostRecent.children[0].innerHTML = dataArray[0].Song;
    mostRecent.children[1].innerHTML = dataArray[0].Artist;
    mostRecent.children[2].innerHTML = dataArray[0].Terms;
  }

  if (dataArray[1]) {
    nextRecent.children[0].innerHTML = dataArray[1].Song;
    nextRecent.children[1].innerHTML = dataArray[1].Artist;
    nextRecent.children[2].innerHTML = dataArray[1].Terms;
  }

  if (dataArray[2]) {
    lastRecent.children[0].innerHTML = dataArray[2].Song;
    lastRecent.children[1].innerHTML = dataArray[2].Artist;
    lastRecent.children[2].innerHTML = dataArray[2].Terms;
  }

};





// Using the stored search terms to pull up the exact result upon clicking the recent search buttons.
var goToMostRecent = function () {
  var songReference = mostRecent.children[2].innerHTML;
  queryLyrics(songReference);
};

var goToNextRecent = function () {
  var songReference = nextRecent.children[2].innerHTML;
  queryLyrics(songReference);
};

var goToLastRecent = function () {
  var songReference = lastRecent.children[2].innerHTML;
  queryLyrics(songReference);
};



userForm.addEventListener("submit", formSubmitHandler);
mostRecent.addEventListener("click", goToMostRecent);
nextRecent.addEventListener("click", goToNextRecent);
lastRecent.addEventListener("click", goToLastRecent);

init();
//to display locally stored recent searches on load.