var ObjectID = require('mongodb').ObjectID;
//var bcrypt = require('bcrypt-nodejs');

/* The AdminDAO must be constructed with a connected database object */
function EcomDAO(db) {
    "use strict";
	
    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof EcomDAO)) {
        console.log('Warning: EcomDAO constructor called without "new" operator');
        return new EcomDAO(db);
    }
	
	var product = db.collection("product"); // get the product collection
	var cart = db.collection("cart"); // get the product collection
			
	
	this.test = function() {
		console.log("in the dao layer");
	};
	
	this.showProductByCategory = function(category, callback) {
		
		var query = {"category" : category};
		var proj = {"_id" : -1, "partNumber" : 1, "name" : 1, "description" : 1, "path" : 1, "priceInfo" : 1, "details" : 1};
		product.find(query, proj).toArray(function(err, result){
			if(err){
				callback(err, null);
			} else {
				console.log(result);
				callback(null, result);
			}
		});
	}
	
	this.searchProduct = function(searchTerm, callback) {
		
		var query = {"name" : {$regex : searchTerm, $options : 'i'}};
		//var query = {"name" : new RegExp(searchTerm, 'i')};
		
		var proj = {"_id" : -1, "partNumber" : 1, "name" : 1, "description" : 1, "path" : 1, "priceInfo" : 1, "details" : 1};
		product.find(query, proj).toArray(function(err, result){
			if(err){
				callback(err, null);
			} else {
				console.log(result);
				callback(null, result);
			}
		});
	}
	
	this.sortByPrice = function(searchTerm, skip, limit, ordr, callback) {
		
		var query = {"name" : {$regex : searchTerm, $options : 'i'}};
		//var query = {"name" : new RegExp(searchTerm, 'i')};
		
		var proj = {"_id" : -1, "partNumber" : 1, "name" : 1, "description" : 1, "path" : 1, "priceInfo" : 1, "details" : 1};
		var srt = {"priceInfo.0.price" : ordr};
		product.find(query, proj).skip(skip).limit(limit).sort(srt).toArray(function(err, result){
			if(err){
				callback(err, null);
			} else {
				console.log(result);
				callback(null, result);
			}
		});
	}
	
	this.addToCart = function(partNumber, qtyPurchased, cartId, callback) {
		
		qtyPurchased = parseInt(qtyPurchased, 10);
		var carted = {"cartId" : cartId, "qty" : qtyPurchased, "ts" : new Date()};
		//console.log(carted);
		var qrytoUpdate = {"partNumber" : partNumber, "inventory.totalQty" : {$gte : qtyPurchased}};
		//console.log("Query - "+ qrytoUpdate);
		var ops = {"new" : true};
		var toUpdate = {$inc : {"inventory.totalQty" : -qtyPurchased}, $set : {"inventory.lastUpdatedOn" : new Date()} , $push : {"carted" : carted}};
		//console.log("To Update - "+toUpdate);
		
		
		// update the inventory - decrease the quantity
		product.findAndModify(qrytoUpdate, {}, toUpdate, ops, function(err, result){
			
			if (err) {
				console.warn(err.message); // returns error if no matching object found
				return callback(err, null);
			} else if(result){
				//console.dir(result.seqNo);
				
				var qry = {"_id": cartId, "status" : "A"};
				var upd = {$set : {"lastModifiedOn" : new Date()}, $push : {"items" : {"partNumber" : partNumber, "qty" : qtyPurchased}}};
				ops = {"upsert" : true};
				
				// on success - update the cart - increase the quantity
				cart.update(qry, upd, ops, function(err, res){
					
					if (err) {
						console.warn(err.message);
						
						// for error - roll back the inventory update
						toUpdate = {$inc : {"inventory.totalQty" : qtyPurchased}, $set : {"inventory.lastUpdatedOn" : new Date()} , $pull : {"carted" : carted}};
						qrytoUpdate = {"partNumber" : partNumber};
						
						product.update(qrytoUpdate, toUpdate, function(err, rollbackres){
							if (err) {
								console.warn(err.message); // returns error if no matching object found
								return callback(err, null);
							} else {
								err = {"err" : "Item added back to the inventory"};
								console.log("Item added back to the inventory - "+cartId);
								callback(err, rollbackres);
							}
						});
						
					} else {
						//console.log("Part Number"+partNumber+" added to cart "+cartId);
						console.log("Item Left in inventory - "+result.inventory.totalQty);
						callback(err, result);
					}
					
				});
			} else {
				console.log("Item not available in inventory for cart id - "+cartId);
				err = {"err" : "No Item Available"};
				callback(err, null);
			}
			
		});
		
	};
	
	
	
	this.removeFromCart = function(partNumber, qtyRemoved, cartId, callback) {
		
		
	};
	

}

module.exports.EcomDAO = EcomDAO;
