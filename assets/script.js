//seatgeek client id
var clientId = 'Mjk0MDgzNjF8MTY2NDQxODE0Mi4zNTAzNjUy';
var artistName;

fetch(`https://api.seatgeek.com/2/events?performers.slug=${artistName}&client_id=${clientId}`)
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    // response.json(json);
    console.log(json);
  }).catch(function(error) {
    console.log(error);
  });

const userForm = document.querySelector('#user-form');
const lyricSearch = document.querySelector('#search-terms');

const songName = document.querySelector('#song-name');
const artistName = document.querySelector('#artist-name');
const spotifyLink = document.querySelector('#spotify-link');
const lyricsBtn = document.querySelector('#lyrics-btn');
const lyricScroll = document.querySelector('#lyric-scroll');


var formSubmitHandler = function (event) {
    event.preventDefault();

    var searchTerms = lyricSearch.value;

    if (searchTerms) {
        queryLyrics(searchTerms);

        lyricSearch.value = '';
    } else {
        alert("WHOOPS");
    }
};





const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'de19aa5cf7msh73ad2831c334120p1ea066jsnd0b0feb55b4a',
		'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
	}
};

var queryLyrics = function (searchTerms) {
    console.log(searchTerms);

fetch('https://shazam.p.rapidapi.com/search?term=' + searchTerms + '&locale=en-US&offset=0&limit=1', options)
	.then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                console.log(data.tracks.hits[0].track.title);
                songName.innerHTML = data.tracks.hits[0].track.title;
                artistName.innerHTML = data.artists.hits[0].artist.name;
                lyricScroll.innerHTML = data.tracks.hits[0].snippet;
                artistImage = data.tracks.hits[0].track.images.coverart;
                console.log(artistImage);
                document.body.style.backgroundRepeat = "no-repeat";
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundImage = "url('" + artistImage + "')";
            })
        }
    })

};



userForm.addEventListener("submit", formSubmitHandler);





// const encodedParams = new URLSearchParams();
// encodedParams.append("consumerKey", "<REQUIRED>");
// encodedParams.append("consumerSecret", "<REQUIRED>");
// encodedParams.append("appKey", "<REQUIRED>");

// const optionstwo = {
// 	method: 'POST',
// 	headers: {
// 		'content-type': 'application/x-www-form-urlencoded',
// 		'X-RapidAPI-Key': 'de19aa5cf7msh73ad2831c334120p1ea066jsnd0b0feb55b4a',
// 		'X-RapidAPI-Host': 'Eventfulvolodimir-kudriachenkoV1.p.rapidapi.com'
// 	},
// 	body: encodedParams
// };

// fetch('https://eventfulvolodimir-kudriachenkov1.p.rapidapi.com/searchEvents', optionstwo)
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));
