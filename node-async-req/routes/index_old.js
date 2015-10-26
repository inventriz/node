var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var async = require("async");
client = new Client();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home');
});

/*
 * call search api
 * 	for all search result {
 * 		call image api
 * 		call reviews api
 * }
 */
router.get('/search', function (req, res){
	
	// registering remote methods
	client.registerMethod("jsonMethod", "http://localhost:4567/search/bykeyword?searchTerm=random&as=json", "GET");
	
	var req1 = client.methods.jsonMethod(function(data,response){
		// parsed response body as js object
		var resData = JSON.parse(data);
		var cnt = resData.count;
		console.log(cnt);
		var itemList = resData.item;
		res.json(resData);
		
	});
	
	req1.on('error', function(err){
		res.json('{status: "failed", msg : '+err);
	});

});

router.get('/image/:id', function (req, res){
	
	// registering remote methods
	client.registerMethod("jsonMethod", "http://localhost:4568/listing/images?productId="+req.params.id, "GET");
	
	var imgReq = client.methods.jsonMethod(function(data,response){
		// parsed response body as js object
		var resData = JSON.parse(data);
		res.json(resData);
	});
	
	imgReq.on('error', function(err){
		res.json('{status: "failed", msg : Image request failed for '+req.params.id+' with error : '+err);
	});

});

router.get('/review/:id', function (req, res){
	
	// registering remote methods
	client.registerMethod("jsonMethod", "http://localhost:4568/listing/reviews/seller?sellerid="+req.params.id, "GET");
	
	var revReq = client.methods.jsonMethod(function(data,response){
		// parsed response body as js object
		var resData = JSON.parse(data);
		res.json(resData);
	});
	
	revReq.on('error', function(err){
		res.json('{status: "failed", msg : Review request failed for '+req.params.id+' with error : '+err);
	});
	

});


module.exports = router;
