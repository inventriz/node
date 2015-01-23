// This file handles the configuration of the app.
// It is required by app.js

var express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser');

module.exports = function(app){

	// Set .html as the default template extension
	app.set('view engine', 'html');

	// Initialize the ejs template engine
	app.engine('html', require('ejs').renderFile);

	// Tell express where it can find the templates
	app.set('views', __dirname + '/views');

	// Make the files in the public folder available to the world
	app.use(express.static(__dirname + '/public'));
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded());
	app.use(cookieParser());

	// Hiding log messages from socket.io. Comment to show everything.
	//io.set('log level', 1);

};