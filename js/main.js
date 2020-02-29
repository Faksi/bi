$(document).ready(function(){

	var _url = "https://my-json-server.typicode.com/Faksi/PWA_API/products"

	var dataResults = ''
	var catResults = ''
	var categories = []

	function renderPage(data) {

			$.each(data, function(key, items) {
				dataResults += "<div>"
							+"<h3>"+ items.name +"</h3>"
							+"<p>"+ items.category +"</p>"
							+"<div><hr>";

				if ($.inArray(items.category, categories) == -1) {
					categories.push(items.category)
					catResults += "<option value=" + items.category + ">"+ items.category +"</option>"
				}
			});

			$("#options").html('<option value="All">All</option>' + catResults);
			$("#products").html(dataResults);
	}

	var networkDataReceived = false

	//REFRESH DATA FROM ONLINE
	var networkUpdate = fetch(_url).then(function (response) {
		return response.json()
	}).then(function (data) {
		networkDataReceived = true
		renderPage(data)
	})

	//RETURN DATA FROM CACHE_NAME
	caches.match(_url).then(function (response) {
		if(!response) throw Error('no data from cache')
		return response.json()
	}).then(function (data) {
		if(!networkDataReceived){
			renderPage(data)
			console.log("render data from cache")
		}
	}).catch(function () {
		return networkUpdate
	})


	$("#options").on("change", function(){
		updateOption($(this).val())
	})

	function updateOption(arg) {

		var dataResults = ''
		var _newURL = _url

		if(arg != "All"){
			_newURL += "?category=" + arg
		}

		$.get(_newURL, function(data) {

			$.each(data, function(key, items) {
				dataResults += "<div>"
							+"<h3>"+ items.name +"</h3>"
							+"<p>"+ items.category +"</p>"
							+"<div><hr>";
			});

			$("#products").html(dataResults);
		});
	}
});

// PWA
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('/service_worker.js').then(function(registration) {
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		}, function(err) {
			console.log('ServiceWorker registration failed: ', err);
		});
	});
}
