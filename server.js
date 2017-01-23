var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var EMED3_COLLECTION = "documents";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// EMED3 API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/documents"
 *    GET: finds all documents
 *    POST: creates a new document
 */

app.get("/documents", function(req, res) {
  db.collection(EMED3_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get documents.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/documents", function(req, res) {
  var newDocument = req.body;
  newDocument.createDate = new Date();
  newDocument.submitMethod = "api";

  if (!(req.body.firstName || req.body.lastName)) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  db.collection(EMED3_COLLECTION).insertOne(newDocument, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new document.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/documents/:id"
 *    GET: find document by id
 *    PUT: update document by id
 *    DELETE: deletes document by id
 */

app.get("/documents/:id", function(req, res) {
  db.collection(EMED3_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get document");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/documents/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(EMED3_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update document");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/documents/:id", function(req, res) {
  db.collection(EMED3_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete document");
    } else {
      res.status(204).end();
    }
  });
});
