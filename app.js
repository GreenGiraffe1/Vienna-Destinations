var ViennaModel = {
	locations: [
		{
			name: 'WW2 Flak Tower',
			coordinates: {lat: 48.22563, lng: 16.372815},
			wikiPageID: 1369643,
			officialWikiTitle: null
		},
		{
			name: 'Vienna Rose Garden',
			coordinates: {lat: 48.208056, lng: 16.361111},
			wikiPageID: 22533198,
			officialWikiTitle: null

		},
		{
			name: "Mozart's House",
			coordinates: {lat: 48.207778, lng: 16.375278},
			wikiPageID: 28369776,
			officialWikiTitle: null
		},
		{
			name: 'Schönbrunn Palace',
			coordinates: {lat: 48.184516, lng: 16.311865},
			wikiPageID: 165202,
			officialWikiTitle: null
		},
		{
			name: 'Vienna Opera House',
			coordinates: {lat: 48.202778, lng: 16.369111},
			wikiPageID: 379066,
			officialWikiTitle: null
		},
		{
			name: 'Hofburg Palace',
			coordinates: {lat: 48.206507, lng: 16.365262},
			wikiPageID: 1651794,
			officialWikiTitle: null
		},
		{
			name: 'Museum of Military History',
			coordinates: {lat: 48.185278, lng: 16.3875},
			wikiPageID: 2680555,
			officialWikiTitle: null
		}
	]
};

// var map;
function initMap(list) {
	// Constructor creates a new map - only center and zoom are required.
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 48.205, lng: 16.366667},
		zoom: 13,
		mapTypeControl: false
	});
	markerMaker(list, map)
}

function markerMaker(list, map) {
	//Create a new blank array for all the listing markers.
	var markers = [];
	var infoWindow = new google.maps.InfoWindow({
	});

	for (var i = 0; i < list.length; i++) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(list[i]['coordinates']['lat'], list[i]['coordinates']['lng']),
			map: map,
			title: list[i].name,
			summaryID: list[i].wikiPageID,
			id: i
		});
		//  Add each individual marker to the "markers" array
		markers.push(marker);
		// console.log(marker.title);

		//  Set the animation for clicking on any map marker   TODO: Use this syntax for list-view items
		marker.addListener('click', function() {
			// this.setAnimation(google.maps.Animation.DROP);  //  Wow - all I had to do was change "marker" to "this"
			populateInfoWindow(this, infoWindow);  //  Call's the info-window function - will populate with right information
		});
	}
}

function populateInfoWindow(marker, infowindow) {
// retrieveWikiInfo(marker.summaryID);

	var wikiPageURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=" + marker.summaryID + "&exintro=1";
	$.ajax({ url : wikiPageURL, dataType : "jsonp",
		success : function(response) {
			var wikiSummary = response['query']['pages'][marker.summaryID]['extract'];
			infowindow.setContent('<h3 id="location-title">' + marker.title + '</h3><div id="summary">' + wikiSummary + '</div>');
			marker.setAnimation(google.maps.Animation.DROP);  //  Wow - all I had to do was change "marker" to "this"

			infowindow.open(map, marker);
		}
	});
}

var ViewModel = function() {
	// http://knockoutjs.com/documentation/computedObservables.html#managing-this
	var self = this;

	self.viennaList = ko.observableArray();
	for (var i = 0; i < ViennaModel.locations.length; i++) {
		self.viennaList.push(ViennaModel.locations[i]);
		// console.log(self.viennaList()[i]['name']);  //  This confirms that it works
	}
	var text = 'you';
	initMap(self.viennaList());
}

var vm = new ViewModel();

ko.applyBindings(vm);
