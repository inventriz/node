var EcomServiceHandler = require('./service/ecomServiceHandler');


module.exports = function(app,db){

	var ecomServiceHandler = new EcomServiceHandler(db);
	
	// http://localhost:8080/showProductbyCategory/Electronics
	app.get('/showProductbyCategory/:category', ecomServiceHandler.showProductByCategory);
	
	// http://localhost:8080/searchProduct/apple
	app.get('/searchProduct/:searchterm', ecomServiceHandler.searchProduct);
	
	// http://localhost:8080/sortByPrice/apple/0/10/-1
	app.get('/sortByPrice/:searchterm/:skip/:limit/:order', ecomServiceHandler.sortByPrice);
	
	
	app.get('/cart', ecomServiceHandler.showCart);
	
	app.post('/addtocart', ecomServiceHandler.addToCart);
	
	

};
