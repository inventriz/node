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
				doEachOperation(data.item, function(err, data){
					console.log(data);						
				});				
			}	
			$(objId).html(resHtml);
		});
		
		
		
		
  	};
  });
});


function doEachOperation(itemList, callback){
	async.each(itemList, doParallel2, function(err, data){
		callback(data);
	});
}


function doParallel2(item, callback){
	
	var resRow = {};
	
	async.parallel([
			function(callback){				
				$.get('/image/'+item.id, function(data){
					console.log(new Date()+"Downloading image for "+item.id);
					console.log("Image data = "+data.results[0].url_fullxfull);
					resRow['img'] = data.results[0].url_fullxfull;
					callback(null, resRow);	    
				});				        	
			},
			function(callback){
				
				$.get('/review/'+item.user_id, function(data){
					
					$.map(data.results, function(rev, i){
						console.log(new Date()+" getting reviews for "+rev.message);
					});
					resRow['reviews'] = data.results;
					callback(null, resRow);	
				});					            	
			}   
		], callback);
}




