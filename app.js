// http://api.jquery.com/jQuery.getJSON/

var APIcall = "http://words.bighugelabs.com/api/2/185bb5ddb325382201efac61e7b7b853/connect/json?callback=?";
$.getJSON(APIcall, function(data){
	console.log("Success! Raw data: ", data);
	$.each( data.verb.syn, function (i, syn) {
		console.log(syn);
	});
});