var mapMarkerNews;
var crashMarkers = [];
var hazardMarkers = [];
var theftMarkers = [];
var unconfirmedMarkers = [];
var rackMarkers = [];

// Instantiation
const textFields = document.querySelectorAll('.mdc-text-field');
textFields.forEach(text => {
	new mdc.textField.MDCTextField(text);
});

// Set text input bar to ripple
mdc.ripple.MDCRipple.attachTo(document.querySelector('.list-button'));

const list = mdc.list.MDCList.attachTo(document.querySelector('.mdc-list'));
list.wrapFocus = true;
const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

// Set topbar and add listener to open side bar
const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(document.getElementById('app-bar'));
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
	drawer.open = !drawer.open;
});

// checkbox and form

const checkboxs = document.querySelectorAll('.mdc-checkbox');
var mdcCheckboxs = []
checkboxs.forEach(box => {
	var newBox = new mdc.checkbox.MDCCheckbox(box);
	mdcCheckboxs.push(newBox);
})
const formField = new mdc.formField.MDCFormField(document.querySelector('.mdc-form-field'));

// Left bar list and listener
const listEl = document.querySelector('.mdc-drawer .mdc-list');
const mainContentEl = document.querySelector('.main-content');

document.body.addEventListener('MDCDrawer:closed', () => {
	mainContentEl.querySelector('input, button').focus();
});

// click Listener for Filter's list button
document.querySelector(".list-button").addEventListener("click", evt => {

	urlToMap();
	document.querySelector("#drawerList").click();

});
// click Listener for Filter's map button
document.querySelector(".map-button").addEventListener("click", evt => {

	urlToMap();
	document.querySelector("#drawerMap").click();

});

var links = document.querySelectorAll(".mdc-list-item");
links.forEach( link => {
	link.addEventListener("click", e => {
		var name = link.getAttribute("data-toScreen");
		document.querySelectorAll(".myPage").forEach(page => { 
			page.style.display = "none";
		});
		document.querySelector(".myPage#" + name).style.display = "block";

	});
});

function urlToMap(){
	// Read inputs
	inLocation = document.querySelector("#location").value;
	var afterUTC = "0";
	var beforeUTC = "0";
	if(inLocation === "")
		inLocation = "Chicago IL";
	inProximity = document.querySelector("#proximity").value;
	if(inProximity === "")
		inProximity = "30";
	inBefore = document.querySelector("#before").value;
	if(inBefore != ""){
		beforeDate = inBefore.split("-");
		beforeUTC = (Date.UTC(beforeDate[0], beforeDate[1], beforeDate[2])/1000).toString();
	}
	inAfter = document.querySelector("#after").value;
	if(inAfter != ""){
		afterDate = inAfter.split("-")
		afterUTC = (Date.UTC(afterDate[0], afterDate[1], afterDate[2])/1000).toString();
	}
	var incidentTypes = [];

	mdcCheckboxs.forEach(check => {
		if(check.checked){
			incidentTypes.push(check.root.firstElementChild.id);
		}
	});
	console.log(incidentTypes);
	var urlLimit = "30";
	if(incidentTypes.length === 0);
		urlLimit = "60";

		// Create URL
		var mapurl = "https://bikewise.org/api/v2/locations/markers?";
		if(beforeUTC != "0"){
			mapurl += "&occurred_before=" + beforeUTC;
		}
		if(afterUTC != "0"){
			mapurl += "&occurred_after=" + afterUTC;
		}
		
		mapurl += "&proximity=" + inLocation;
		mapurl += "&proximity_square=" + inProximity;
		mapurl += "&limit="+urlLimit;
		

		// Change Description in Filter Page
		var descText = "Showing results for " + inLocation + " within " + inProximity + " miles";
		if(beforeUTC != "0" && afterUTC != "0"){
			descText += " between " + inBefore + " and " + inAfter;
		}
		else if(beforeUTC != ""){
			descText += " before " + inBefore;
		}
		else if(afterUTC != ""){
			descText += " after " + inAfter;
		}
		document.querySelector("#list-desc").innerHTML = descText;

		document.querySelector("#ListResults").innerHTML = "";
		populateMap(mapurl, incidentTypes);
}

function populateCards(url, page){
	fetch (url)
	.then(x => { 
		return x.json()
	})
	.then(json => {
		let i = 0;
		let originalCard = document.querySelector("#list-card");
		for(i = 0; i < json.incidents.length; i++){
			let copy = originalCard.cloneNode(true);
			copy.style.display = "block";
			copy.querySelector(".mdc-card__title").innerHTML = json.incidents[i].title;
			copy.querySelector(".mdc-card__type").innerHTML = json.incidents[i].type;
			let unix = json.incidents[i].occurred_at;
			var date = new Date(unix*1000);
			var minute = date.getMinutes();
			if(minute < 10){
				minute = "0"+minute;
			}
			var formatedDate = date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "     " + date.getHours() + ":" + minute;
			copy.querySelector(".mdc-card__subtitle").innerHTML = formatedDate;
			copy.querySelector(".mdc-card__address").innerHTML = json.incidents[i].address;
			copy.querySelector(".mdc-card__description").innerHTML = json.incidents[i].description;
			
			document.querySelector("#"+page+"Results").appendChild(copy);

			// When address is clicked, bring up map with that address
			copy.querySelector(".mdc-card__address").addEventListener("click", evt => {
	         	// send address to google geocode api and 
	         	// get lat and longitude back
	         	var link = "https://maps.googleapis.com/maps/api/geocode/json?address="
	         	var key = "&key=AIzaSyAa4uCys20g6sytzES1nTnp-dojJ6H1avg"
	         	var address = evt.target.innerHTML;
	         	link = link + address + key;
	         	fetch(link)
	         	.then(z => {
	         		return z.json()
	         	})
	         	.then(zjson => {
	         		if(zjson.status === "OK"){
		          	// remove old marker if there
		          	if(mapMarkerNews != null){
		          		mapMarkerNews.setMap(null);
		          	}
		            //set new cords
		            var latitude = zjson.results[0].geometry.location.lat;
		            var longitude = zjson.results[0].geometry.location.lng;
		            var cords = { lat: latitude, lng: longitude};
		            myMap.setCenter(cords);

					// place marker at cords
					var marker = new google.maps.Marker({
						position: cords,
						map: myMap,
						title: "address",
					});
					mapMarkerNews = marker;

					let infowindow = new google.maps.InfoWindow({
						content: copy.innerHTML
					});

					marker.addListener("click", () => {
						infowindow.open(myMap, marker);
					});
					// bring up map
					document.querySelector("#drawerMap").click();
				}	
			});
	      	}); // end click listener

		}

	});
}

 function populateMap(url, showIncidents){
	// clear the map and remove all previous markers
	crashMarkers.forEach(x => {x.setMap(null);});
	crashMarkers = [];
	hazardMarkers.forEach(x => {x.setMap(null);});
	hazardMarkers = [];
	theftMarkers.forEach(x => {x.setMap(null);});
	theftMarkers = [];
	unconfirmedMarkers.forEach(x => {x.setMap(null);});
	unconfirmedMarkers = [];
	rackMarkers.forEach(x => {x.setMap(null);});
	rackMarkers = [];

	if(showIncidents.length === 0){
		addAlltoList(url);
	}
	showIncidents.forEach(incident => {
		var newUrl = url + "&incident_type=" + incident;
		document.querySelector(".map-toggle#"+incident).classList.add("show");
		addAlltoList(newUrl);
	})

	function addAlltoList(url){
		fetch(url)
		.then(x => {
			return x.json();
		}).then(json => {
			for(var i = 0; i < json.features.length; i++){
				// find cords
				var latitude = json.features[i].geometry.coordinates[1];
				var longitude = json.features[i].geometry.coordinates[0];
				var cords = { lat: latitude, lng: longitude};
			    // choose a color for the marker based on 
			    //var color = "red";
			    //switch(json.features[i].)
			    var id = json.features[i].properties.id.toString();
			    addCardtoList(id, cords);
		    		
			}
		});
	}
	
}
const addCardtoList = async function(id, _cords){
	var url = "https://bikewise.org/api/v2/incidents/"+id;
	var returnValue = [];
	fetch (url)
	.then(x => { 
		return x.json()
	})
	.then(json => {
		let i = 0;
		let originalCard = document.querySelector("#list-card");
		let copy = originalCard.cloneNode(true);
		copy.style.display = "block";
		copy.querySelector(".mdc-card__title").innerHTML = json.incident.title;
		copy.querySelector(".mdc-card__type").innerHTML = json.incident.type;
		let unix = json.incident.occurred_at;
		var date = new Date(unix*1000);
		var minute = date.getMinutes();
		if(minute < 10){
			minute = "0"+minute;
		}
		var formatedDate = date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "     " + date.getHours() + ":" + minute;
		copy.querySelector(".mdc-card__subtitle").innerHTML = formatedDate;
		copy.querySelector(".mdc-card__address").innerHTML = json.incident.address;
		copy.querySelector(".mdc-card__description").innerHTML = json.incident.description;

		document.querySelector("#ListResults").appendChild(copy);

		// When address is clicked, bring up map with that address
		copy.querySelector(".mdc-card__address").addEventListener("click", evt => {
	        // send address to google geocode api and 
	        // get lat and longitude back
	        var link = "https://maps.googleapis.com/maps/api/geocode/json?address="
	        var key = "&key=AIzaSyAa4uCys20g6sytzES1nTnp-dojJ6H1avg"
	        var address = evt.target.innerHTML;
	        link = link + address + key;
	        fetch(link)
	        .then(z => {
	        	return z.json()
	        })
	        .then(zjson => {
	        	if(zjson.status === "OK"){
		          	// remove old marker if there
		          	if(mapMarkerNews != null){
		          		mapMarkerNews.setMap(null);
		          	}
		            //set new cords
		            var latitude = zjson.results[0].geometry.location.lat;
		            var longitude = zjson.results[0].geometry.location.lng;
		            var cords = { lat: latitude, lng: longitude};
		            myMap.setCenter(cords);

					// place marker at cords
					var marker = new google.maps.Marker({
						position: cords,
						map: myMap,
						title: "address",
					});
					mapMarkerNews = marker;

					let infowindow = new google.maps.InfoWindow({
						content: copy.innerHTML
					});

					marker.addListener("click", () => {
						infowindow.open(myMap, marker);
					});
					// bring up map
					document.querySelector("#drawerMap").click();
				}	
			});
	      	}); // end click listener
		
		returnValue.push(copy.innerHTML);
		returnValue.push(json.incident.type);
		addMarker(_cords, returnValue);	
	});
	
}
function addMarker(cords, valArray){
	var innerText = valArray[0];
	var incidentType = valArray[1];

	// choose icon for marker
	var urlBase = "http://maps.google.com/mapfiles/ms/icons/";
	var iconUrl = ""; 
	
	switch(incidentType){
		case "Theft":
			iconUrl = urlBase + "red-dot.png";
			break;
		case "Hazard":
			iconUrl = urlBase + "yellow-dot.png";
			break;
		case "Crash":
			iconUrl = urlBase + "blue-dot.png";
			break;
		case "Unconfirmed":
			iconUrl = urlBase + "purple-dot.png";
			break;
		default:
			iconUrl = urlBase + "green-dot.png";		
			break;
	}
	
	// place marker at cords
	var marker = new google.maps.Marker({
		position: cords,
		map: myMap,
		icon: iconUrl,
	});

	let infowindow = new google.maps.InfoWindow({
		content: innerText,
	});

	google.maps.event.addListener(marker, "click", () => {
		infowindow.open(myMap, marker);
	});

	switch(incidentType){
		case "Theft":
			theftMarkers.push(marker);
			break;
		case "Hazard":
			hazardMarkers.push(marker);
			break;
		case "Crash":
			crashMarkers.push(marker);
			break;
		case "Unconfirmed":
			unconfirmedMarkers.push(marker);
			break;
		default:
			unconfirmedMarkers.push(marker);		
			break;
	}
}

// Click listeners for toggles above map
document.querySelectorAll(".map-toggle").forEach(button => {
	button.addEventListener("click", evt => {
		var type = button.id;
		switch (type){
			case "crash":
				if(evt.target.classList.contains("show")){
					crashMarkers.forEach(marker => {marker.setMap(null)});
					evt.target.classList.remove("show");
				}
				else{
					crashMarkers.forEach(marker => {marker.setMap(myMap)});
					evt.target.classList.add("show");
				}
				break;
			case "hazard":
				if(evt.target.classList.contains("show")){
					hazardMarkers.forEach(marker => {marker.setMap(null)});
					evt.target.classList.remove("show");
				}
				else{
					hazardMarkers.forEach(marker => {marker.setMap(myMap)});
					evt.target.classList.add("show");
				}
				break;
			case "theft":
				if(evt.target.classList.contains("show")){
					theftMarkers.forEach(marker => {marker.setMap(null)});
					evt.target.classList.remove("show");
				}
				else{
					theftMarkers.forEach(marker => {marker.setMap(myMap)});
					evt.target.classList.add("show");
				}
				break;
			case "unconfirmed":
				if(evt.target.classList.contains("show")){
					unconfirmedMarkers.forEach(marker => {marker.setMap(null)});
					evt.target.classList.remove("show");
				}
				else{
					unconfirmedMarkers.forEach(marker => {marker.setMap(myMap)});
					evt.target.classList.add("show");
				}
				break;
		}
	});
}); //end of toggle click listener

// Create a database
const db = new Dexie('My Database');
db.version(3).stores({
	racks: 'address,ward,latitude, longitude, name'
});

// get the Schools data and populate the database
fetch("https://data.cityofchicago.org/resource/cbyb-69xx.json")
.then ( (response) => {return response.json() })
.then ( (result) => {
	for(rack of result){
		db.racks.put({address: rack.address, 	
			ward: rack.ward, 
			latitude: parseFloat(rack.latitude),
			longitude: parseFloat(rack.longitude),
			name: rack.community_name});		
	}
});




