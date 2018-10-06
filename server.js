//Requirements
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

//Port
var PORT = 3000;

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/scraperHW", { useNewUrlParser: true });
// mongoose.connect(MONGODB_URI);

// Handlebars
app.engine(
    "handlebars",
    exphbs({
      helpers: {
        formatDate: function (datetime, format) {
          if (moment) {
            format = DateFormats[format] || format;
            return moment(datetime).format(format);
          }
          else {
            return datetime;
          }
        }
      },
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");

//Routes
require("./controllers/apiRoutes.js")(app);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  