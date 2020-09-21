const request = require("request");

const geocode = (address, callback) => {
  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(address) +
    ".json?access_token=pk.eyJ1IjoiaGltYW5zaHU5OSIsImEiOiJja2YzczFycWYwNjBmMnRtZGhnemV1MHpvIn0.1qh7nVtX--hjXe2RSzrO1w&limit=1";

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to geocoding service!");
    } else if (body.features.length === 0) {
      callback("Unable to find location.Try different search");
    } else {
      callback(undefined, {
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
        place: body.features[0].place_name,
      });
    }
  });
};

module.exports = geocode;
