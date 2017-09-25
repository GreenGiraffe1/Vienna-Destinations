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

function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	vm.map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 48.205, lng: 16.366667},
		zoom: 13,
		mapTypeControl: false
	});
	//markerMaker(list, map);
	vm.makeMarkers(map);
	infoWindow1 = new google.maps.InfoWindow({});

}

function googleError() {
	//  This function is invoked if the Google Maps API isn't reachable
	var errorMsg = '<div>Error - Google Maps cannot be reached</div>';
	$('#map').append(errorMsg);
}

function markerMaker(list, map) {
	//Create a new blank array for all the listing markers.
	var markers = [];
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
		marker.addListener('click', function() {
			populateInfoWindow(this);  //  Call's the info-window function - will populate with right information
		});
	}
}


function populateInfoWindow(marker) {

	var wikiPageURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=" + marker.summaryID + "&exintro=1";

	//  Build a timeout function for error handling of the JSON-P request to wikipedia, help can be found here:
	//  https://classroom.udacity.com/nanodegrees/nd004/parts/135b6edc-f1cd-4cd9-b831-1908ede75737/modules/271165859175460/lessons/3310298553/concepts/31621285920923
	var wikiRequestTimeout = setTimeout(function() {
		infoWindow1.setContent('<h3 id="location-title">' + marker.title + '</h3><div>(Failed to get Wikipedia Resources)</div>');
		marker.setAnimation(google.maps.Animation.DROP);  //  Wow - all I had to do was change "marker" to "this"
		infoWindow1.open(map, marker);
	}, 2000);

	$.ajax({ url : wikiPageURL, dataType : "jsonp",
		success : function(response) {
			var wikiSummary = response['query']['pages'][marker.summaryID]['extract'];
			infoWindow1.setContent('<h3 id="location-title">' + marker.title + '</h3><div id="summary">' + wikiSummary + '</div>');
			marker.setAnimation(google.maps.Animation.DROP);  //  Wow - all I had to do was change "marker" to "this"
			infoWindow1.open(map, marker);
			clearTimeout(wikiRequestTimeout);
		}

	});
}

// http://knockoutjs.com/documentation/click-binding.html#note-1-passing-a-current-item-as-a-parameter-to-your-handler-function
function listviewClickListener(data, event) {
	populateInfoWindow(data.marker);
}

var ViewModel = function() {
	var self = this;
	self.viennaList = ko.observableArray();
	for (var i = 0; i < ViennaModel.locations.length; i++) {
		self.viennaList.push(ViennaModel.locations[i]);
		// console.log(self.viennaList()[i]['name']);  //  This confirms that it works
	}
	var text = 'you';

	//initMap(self.viennaList());

	self.makeMarkers = function() {
		var markers = [];
		// var infoWindow = new google.maps.InfoWindow({});

		for (var i = 0; i < self.viennaList().length; i++) {
			self.viennaList()[i].marker = new google.maps.Marker({
				position: new google.maps.LatLng(self.viennaList()[i]['coordinates']['lat'], self.viennaList()[i]['coordinates']['lng']),
				map: vm.map,
				title: self.viennaList()[i].name,
				summaryID: self.viennaList()[i].wikiPageID,
				id: i
			});
			self.viennaList()[i].marker.addListener('click', function() {
				populateInfoWindow(this);  //  Call's the info-window function - will populate with right information
			});
		}
	};
};

var vm = new ViewModel();

ko.applyBindings(vm);
