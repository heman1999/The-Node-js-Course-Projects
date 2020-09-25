const request = require("request");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forescast");

const location = process.argv[2];

if (!location) {
  console.log("Please input location!");
} else {
  geocode(location, (error, { latitude, longitude, place }) => {
    if (error) {
      return console.log("Error: ", error);
    }

    forecast(latitude, longitude, (error, data) => {
      if (error) {
        return console.log("Error: ", error);
      }
      console.log(place);
      console.log(data);
    });
  });
}
