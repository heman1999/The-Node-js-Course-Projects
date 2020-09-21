const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=b51dfef091f6d07bd4c897871358b1b3&query=" +
    latitude +
    "," +
    longitude;
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service!");
    } else if (body.error) {
      callback("Unable to find location");
    } else {
      const data = body.current;
      callback(
        undefined,
        "Overview : " +
          data.weather_descriptions[0] +
          ". It is " +
          data.temperature +
          " deg outside. And " +
          data.precip +
          "mm rain."
      );
    }
  });
};

module.exports = forecast;
