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
					
					$.get('/image/'+product.id, function(data){
						tabHtml += data.results;
					});
					
					$.get('/review/'+product.user_id, function(data){
						tabHtml += data.results;
					});
					
				});
			} else {
				tabHtml = "No Type found";
			}
			resHtml += tabHtml;
			$(objId).html(resHtml);
		});
		
		
		
		
  	};
  });
});




