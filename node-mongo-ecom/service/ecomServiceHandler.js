var EcomDAO = require('../dao/ecomDao').EcomDAO;

/* The EcomServiceHandler must be constructed with a connected db */
function EcomServiceHandler (db) {
    "use strict";
	
	var ecomDao = new EcomDAO(db);
	
	this.showProductByCategory = function(req, res, next){
		
		var category = req.params.category;
		ecomDao.showProductByCategory(category, function(err, result){
			if(err){
				res.send('{status : "E", err : '+err.message+'}');
			} else {
				res.send('{result : '+JSON.stringify(result)+'}');
			}
		});
		
		
	}
	
	this.searchProduct = function(req, res, next){
		var searchTerm = req.params.searchterm;
		console.log("searching for "+searchTerm);
		ecomDao.searchProduct(searchTerm, function(err, result){
			if(err){
				res.send('{status : "E", err : '+err.message+'}');
			} else {
				res.send('{result : '+JSON.stringify(result)+'}');
			}
		});
	}
	
	this.sortByPrice = function(req, res, next){
		var searchTerm = req.params.searchterm;
		var skip = parseInt(req.params.skip, 0);
		var limit = parseInt(req.params.limit, 0);
		var ordr = parseInt(req.params.order, 0);
		
		console.log("searching for "+searchTerm);
		ecomDao.sortByPrice(searchTerm, skip, limit, ordr, function(err, result){
			if(err){
				res.send('{status : "E", err : '+err.message+'}');
			} else {
				res.send('{result : '+JSON.stringify(result)+'}');
			}
		});
	}
	
	
	this.showCart = function(req, res, next){
		res.render('cart');
	};
	
	
	
	this.addToCart = function(req, res, next){
		
		var partNumber = req.body.partNumber;
		var qtyPurchased = req.body.qtyPurchased;
		var cartId = req.body.cartId;
		//console.log("---------------------------");
		//console.log("partNumber - "+partNumber);
		//console.log("qtyPurchased - "+qtyPurchased);
		//console.log("cartId - "+cartId);
		//console.log("---------------------------");
		
		if(partNumber !== null && qtyPurchased !== null && cartId !== null){
			ecomDao.addToCart(partNumber, qtyPurchased, cartId, function(err, result){
				if(err){
					res.send('{status : "E"}');
				} else {					
					res.send('{result : '+result+'}');
				}
			});
		} else {
			res.send('{status : "E"}');
		}
		
	};
	
	
}

module.exports = EcomServiceHandler;
