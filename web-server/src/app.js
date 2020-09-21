const express = require("express");
const path = require("path");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forescast");

const app = express();

// Define paths for express config
const publicDirPath = path.join(__dirname, "../public");
const viewsDirPath = path.join(__dirname, "../templates/views");
const partialsDirPath = path.join(__dirname, "../templates/partials");

// Set up handlebar engine and views location
app.use(express.static(publicDirPath));
app.set("view engine", "hbs");
app.set("views", viewsDirPath);

hbs.registerPartials(partialsDirPath);

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({ error: "Location required!!!" });
  }
  geocode(req.query.address, (error, { latitude, longitude, place } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, data) => {
      if (error) {
        return res.send({ error });
      }

      res.send({ place, data });
    });
  });
});

app.get("*", (req, res) => {
  res.render("notFound");
});

app.listen(3000, () => console.log("Server running...."));
