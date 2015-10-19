/////////////////////////////
////    client side     ////
///////////////////////////


$(function(){
  
  $('#recipeSearchInput').on('keyup', function(e){
  	if(e.keyCode === 13) {
		var parameters = { search: $(this).val() };
  		
		$.get('/search', function(data){
			var objId = "#searchResult";
			var tabHtml = "";
			var resHtml = "<table>"
							+"<tr><td>Search Result</td><td>"+data.count+"</td></tr>"							
							+"</table>";
			
			if(data.item.length > 0) {
				$.map(data.item, function(product, i){
					
					doParallel(product.id, product.user_id, function(err, data){
						console.log(data);						
					});				
					
				});
			}			
			
			
			$(objId).html(resHtml);
		});
		
		
		
		
  	};
  });
});

function doParallel(id, uid, callback){
	
	var resRow = {};
	
	async.parallel([
			function(callback){				
				$.get('/image/'+id, function(data){
					console.log(new Date()+"Downloading image for "+id);
					console.log("Image data = "+data.results[0].url_fullxfull);
					resRow['img'] = data.results[0].url_fullxfull;
					callback(null, resRow);	    
				});				        	
			},
			function(callback){
				
				$.get('/review/'+uid, function(data){
					
					$.map(data.results, function(rev, i){
						console.log(new Date()+" getting reviews for "+rev.message);
					});
					resRow['reviews'] = data.results;
					callback(null, resRow);	
				});					            	
			}   
		], callback);
}




