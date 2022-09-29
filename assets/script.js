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

  