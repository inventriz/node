/**
 * New node file
 */

var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var Grid = require('gridfs-stream');
var fs = require('fs');

MongoClient.connect('mongodb://localhost:27017/record', function(err, db) {
	var gfs = Grid(db, mongo);
	var fileName = "mypic2.jpg";
	var path = "../input/image2.jpg";

	var fileNameInDB = "mypic11.jpg";
	var opPath = "../output/mypic1.jpg";

	this.loadFile = function(name, path, callback) {

		// streaming to gridfs 
		var writestream = gfs.createWriteStream({
			//_id : ObjectId("54cd28f7836e20880a2ea3a0"), // either filename or _id is needed 
			filename : name,
			root : "photo" // optional
		});
		try {
			fs.createReadStream(path).pipe(writestream);
		} catch (err) {
			console.log(err.message);
		}

		writestream.on('close', function(file) {
			// do something with `file`
			console.log(file.filename + ' Written To DB');
		});
	}

	this.readFile = function(name, path, callback) {

		// streaming from gridfs 
		var readstream = gfs.createReadStream({
			// _id : ObjectId("54cd28f7836e20880a2ea3a0"), // either filename or _id is needed 
			filename : name,
			root : "photo" // optional
		});
		var fs_write_stream = fs.createWriteStream(path);
		try {
			readstream.pipe(fs_write_stream);
		} catch (err) {
			console.log(err.message);
		}

		//error handling, e.g. file does not exist 
		readstream.on('error', function(err) {
			console.log('An error occurred!', err);
			throw err;
		});

		fs_write_stream.on('close', function() {
			console.log('file has been dowloaded fully!');
		});
	}

	this.removeFile = function(name, callback) {

		// options
		var options = {
			filename : name,
			root: "photo"
		};
		gfs.remove(options, function(err) {
			if (err) {
				console.error('Error occurred ' + err);
			} else {
				console.log('Delete Success for ' + name);
			}

		});
		
	}

	//	this.readFile(fileNameInDB, opPath, function(err){
	//		if(err){
	//			console.error("Error occurred "+err);
	//		}
	//	});

	//	this.loadFile(fileName, path, function(err) {
	//		if (err) {
	//			console.error("Error occurred " + err);
	//		}
	//	});
	
//	this.removeFile("mypic2.jpg", function(err){
//		if (err) {
//			console.error("Error occurred " + err);
//		}
//	});
	
	gfs.files.find({root : "photo"}).toArray(function(err, results){
		console.log(results);
	});

});
