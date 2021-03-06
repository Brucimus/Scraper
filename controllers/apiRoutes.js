var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

// Initialize Express
var app = express();

module.exports = function (app) {
    app.get("/", function(req, res) {
        res.render("index");
      })

    // A GET route for scraping the echoJS website
    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=elite+screens").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
    
        // Now, we grab every h2 within an products tag, and do the following:
        $(".a-col-right div div").each(function(i, element) {
            // Save an empty result object
            var result = {};
    
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
            .children("a")
            .attr("title");
            result.link = $(this)
            .children("a")
            .attr("href");
    
            // Create a new Product using the `result` object built from scraping
            db.Product.create(result)
            .then(function(dbProduct) {
                // View the added result in the console
                console.log(dbProduct);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                return res.json(err);
            });
        });
    
        // If we were able to successfully scrape and save an Product, send a message to the client
        res.send("Scrape Complete");
        });
    });
    
    // Route for getting all Products from the db
    app.get("/products", function(req, res) {
        // console.log("hi");
        // Grab every document in the Products collection
        db.Product.find({})
        .then(function(dbProduct) {
            // If we were able to successfully find Products, send them back to the client
            res.json(dbProduct);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });
    
    // Route for grabbing a specific Product by id, populate it with it's note
    app.get("/products/:id", function(req, res) {
        // console.log("one");
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Product.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("notes")
        .then(function(dbProduct) {
            // console.log("two");
            // If we were able to successfully find an Product with the given id, send it back to the client
            res.json(dbProduct);
        })
        .catch(function(err) {
            console.log(err);
            // If an error occurred, send it to the client
            res.json(err);
        });
    });
    
    // Route for saving/updating an Product's associated Note
    app.post("/products/:id", function(req, res) {
        console.log("one");

        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
        .then(function(dbNote) {
            console.log(req.params.id)
            console.log(dbNote);
            // If a Note was created successfully, find one Product with an `_id` equal to `req.params.id` and push the new Note's _id to the Product's `notes` array
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Product.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote}}, { new: true });
        })
        .then(function(dbProduct) {
            // If we were able to successfully update an Product, send it back to the client
            res.json(dbProduct);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });
};