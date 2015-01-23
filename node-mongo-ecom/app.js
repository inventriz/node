// This is the main file of the distributed messaging system. It initializes a new 
// express.js instance, requires the config and routes files
// and listens on a port. Start the application by running
// 'node app.js' in your terminal

var express = require('express'),
	MongoClient = require('mongodb').MongoClient, // Driver for connecting to MongoDB	
	app = express();

// This is needed if the app is run on heroku:
MongoClient.connect('mongodb://localhost:27017/ecom', function(err, db) {
	
	"use strict";
    if(err) { throw err; }
	
	var port = process.env.PORT || 8080;

	
	// Require the configuration and the routes files, and pass
	// the app and io as arguments to the returned functions.

	require('./config')(app);
	require('./routes')(app, db);

	app.listen(port);
	console.log('Your application is running on http://localhost:' + port);
});
