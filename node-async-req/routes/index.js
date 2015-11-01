var express = require('express');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./props/services.properties');

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
	
	// call service discovery to get a registered service
	getServiceUrl("search", function(err, srchUrl){
		if(err){
			console.log("error occurred accessng search service");
			res.json('{status: "failed", msg : No service available in the registry::'+err);
		} else {
			
			/*
			 * Call the service thru circuit breaker
			 * If the service is not available it try for 3 times
			 * And after the max attempt it will send a default response
			 */
			customCircuitBreaker(srchUrl, 3, function(err, data){
				
				if(err){
					console.log("Error occurred in circuit breaker. Service could not be connected "+err);
					console.log("Sending a default response");
					var resData = {};
					resData['count'] = 0;
					resData['item'] = [];
					res.json(resData);
				} else {
					// parsed response body as js object
					var resData = JSON.parse(data);
					var cnt = resData.count;				
					var itemList = resData.item;
					res.json(resData);
				}
				
				
			});
			
		}
	});
	
});

router.get('/image/:id', function (req, res){
	
	// call service discovery to get a registered service
	getServiceUrl("image", function(err, data){
		if(err){
			console.log("error occurred accessng image service");
			res.json('{status: "failed", msg : No service available in the registry::'+err);
		} else {
			var imgUrl = data+req.params.id;
			
			/*
			 * Call the service thru circuit breaker
			 * If the service is not available it try for 3 times
			 * And after the max attempt it will send a default response
			 */
			customCircuitBreaker(imgUrl, 3, function(err, data){				
				if(err){
					console.log("Error occurred in circuit breaker. Service could not be connected. "+err);
					console.log("Sending a default response");
					var resData = {};
					resData['results'] = [];
					resData['results'][0] = {'url_fullxfull' : "http://dummyimageservice.com/noimg.jpg"};
					res.json(resData);
				} else {
					// parsed response body as js object
					var resData = JSON.parse(data);					
					res.json(resData);
				}
			});
			
		}
	});
	
	

});

router.get('/review/:id', function (req, res){
	
	// call service discovery to get a registered service
	getServiceUrl("review", function(err, data){
		if(err){
			console.log("error occurred accessng review service");
			res.json('{status: "failed", msg : No service available in the registry::'+err);
		} else {
			var revUrl = data+req.params.id;
			
			/*
			 * Call the service thru circuit breaker
			 * If the service is not available it try for 3 times
			 * And after the max attempt it will send a default response
			 */
			customCircuitBreaker(revUrl, 3, function(err, data){				
				if(err){
					console.log("Error occurred in circuit breaker. Service could not be connected. "+err);
					console.log("Sending a default response");
					var resData = {};
					resData['count'] = 0;
					resData['results'] = [];
					res.json(resData);
				} else {
					// parsed response body as js object
					var resData = JSON.parse(data);					
					res.json(resData);
				}
			});
			
		}
	});
	
	
	

});


/*
 * 	A sample implementation of a service discovery method
 *  in reality this can be another node module having a file system or db 
 *  to store the service registry
 *  dynamically it sould check the connectivity 
 *  and return the service url
 *  
 *  The basic idea I want to establish is,
 *  the service url should be picked up from the registry
 *  based on the availability
 */

function getServiceUrl(serviceName, callback){	
	console.log("Getting url for "+serviceName+" from registry");
	var data = properties.get(serviceName+'.service.url', function(err, data){
		if(err){
			console.log(err);
			callback(err, null);
		}
	});
	
	var urls = data.split(',');
	var no = Math.floor(Math.random() * (urls.length));
	var url = urls[no];
	callback(null, url);
	
}

function callService(url, callback){
	
	client.registerMethod("jsonMethod", url, "GET");
	var req1 = client.methods.jsonMethod(function(data,response){
		callback(null, data);
	});
			
	req1.on('error', function(err){
		callback(err, null);		
	});
}

/*
 * This is a custom circuit breaker implementation
 * This function takes the service url to call 
 * and the number max attempt it should try 
 * in case the service is not available
 * 
 * It calls same service after every 3000 ms
 * in case the service is not available 
 */
function customCircuitBreaker(url, maxTry, callback){
	
	var isError = false;
	var err = null;
	
	(function callRec(){		
		callService(url, function(err, data){
			if(err){
				isError = true;
				console.log("circuit open");				
				if(maxTry>0){
					console.log("Trying next attempt at "+new Date());
					setTimeout(callRec, 3000);
				} else {
					callback(err, null);
				}				
			} else {
				console.log("circuit closed");
				isError = false;
				callback(null, data);
			}
		});
		maxTry--;
	})();
		
}

module.exports = router;
