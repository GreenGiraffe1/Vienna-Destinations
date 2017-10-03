var ViennaModel = {
	locations: [
		{
			name: 'WW2 Flak Tower',
			coordinates: {lat: 48.22563, lng: 16.372815},
			wikiPageID: 1369643,
			wikiUrl: 'Flak_tower'
		},
		{
			name: 'Vienna Rose Garden',
			coordinates: {lat: 48.208056, lng: 16.361111},
			wikiPageID: 22533198,
			wikiUrl: 'Volksgarten,_Vienna'

		},
		{
			name: "Mozart's House",
			coordinates: {lat: 48.207778, lng: 16.375278},
			wikiPageID: 28369776,
			wikiUrl: 'Mozarthaus_Vienna'
		},
		{
			name: 'Schonbrunn Palace',
			coordinates: {lat: 48.184516, lng: 16.311865},
			wikiPageID: 165202,
			wikiUrl: 'Schönbrunn_Palace'
		},
		{
			name: 'Vienna State Opera',
			coordinates: {lat: 48.202778, lng: 16.369111},
			wikiPageID: 379066,
			wikiUrl: 'Vienna_State_Opera'
		},
		{
			name: 'Hofburg Palace',
			coordinates: {lat: 48.206507, lng: 16.365262},
			wikiPageID: 1651794,
			wikiUrl: 'Hofburg'
		},
		{
			name: 'Museum of Military History',
			coordinates: {lat: 48.185278, lng: 16.3875},
			wikiPageID: 2680555,
			wikiUrl: 'Museum_of_Military_History,_Vienna'
		}
	]
};


/**
* @description Creates a new map object - only center and zoom are required
* @constructor
*/
function initMap() {
	vm.map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 48.205, lng: 16.366667},
		zoom: 13,
		mapTypeControl: false
	});
	vm.makeMarkers();
	//  Global infowindow variable
	infoWindow1 = new google.maps.InfoWindow({});
}


/**
* @description Displays an error message if the Goolge Maps API is unreachable
*/
function googleError() {
	var errorMsg = '<div>Error - Google Maps cannot be reached</div>';
	$('#map').append(errorMsg);
}


/**
* @description Creates an infowindow pop-up on the map portion of the screen
* providing information about the item which has been clicked on (and
* subsequently passed to this function). The information to be displayed is
* retrieved from Wikipedia's API. If the API can't be reached an error message
* is displayed.
* @param {object} marker - Google Maps location marker
*/
function populateInfoWindow(marker) {
	var wikiPageURL = 'https://en.wikipedia.org/w/api.php?action=query&' +
        'format=json&prop=extracts&pageids=' + marker.summaryID +
        '&exintro=1';

	/**
	* @description Queries the Wikipedia API for information about locations.
	* If successful, it appends the information to the info-window. If
	* unsuccessful it returns an error message.
	* @param {string} url - API url with page ID parameter
	* @param {string} dataType - tells the API what type of request is being
	* made
	*/
	$.ajax({ url : wikiPageURL, dataType : 'jsonp'
	}).done	(function (response) {
		//  Do this if all works as it should
		var wikiSummary = response['query']['pages'][marker.summaryID]
			['extract'];
		infoWindow1.setContent('<h3 id="location-title">' + marker.title +
			'</h3><div id="summary">' + wikiSummary + '</div>' +
			'<div id="attribution">' + 'Information retrieved from ' +
			'<a href="https://en.wikipedia.org/wiki/' + marker.url +
			'">' + marker.title + '</a> page on ' +
			'<a href="https://www.wikipedia.org/">' +
			'Wikipedia' + '</a>.</div>');
		marker.setAnimation(google.maps.Animation.DROP);
		infoWindow1.open(map, marker);
	}).fail(function () {
		//  Do this if encountering an error
		infoWindow1.setContent('<h3 id="location-title">' + marker.title +
			'</h3><div>(Failed to get Wikipedia Resources)</div>');
		marker.setAnimation(google.maps.Animation.DROP);
		infoWindow1.open(map, marker);
	})
}


/**
* @description Click event listener on the listview items. Will call program
* to display information on the map about the clicked item.
*/
function listviewClickListener(data, event) {
	populateInfoWindow(data.marker);
    //  Shuts the menu (for mobile) when a list item is clicked
    $('.hamIcon').click();
}


/**
* @description Represents the ViewModel which controls flow of events
* @constructor
*/
var ViewModel = function() {
	var self = this;
	self.viennaList = ko.observableArray();
	//  Add all components of the static Model to the K.O. observable array
	for (var i = 0; i < ViennaModel.locations.length; i++) {
		self.viennaList.push(ViennaModel.locations[i]);
	}
	self.userText = ko.observable('');

	/**
	* @description KO computed observable uses matching logic to control which
	*  markers and list items are visible on the DOM.
	*/
	self.newFilteredList = ko.computed(function() {
		if (!self.userText()) {
			// Return the original array if there is no user input
			return self.viennaList();
		} else {
			//  Filtering mechanism, returns the filtered array here
			return ko.utils.arrayFilter(self.viennaList(), function(item) {
				//  Returns true if the user input string is found in the name
				//  of the current item being passed, (case insensitive)
				return (item.name.toLowerCase().indexOf(
					self.userText().toLowerCase()) > -1);
			});
		}
	});

	/**
	* @description Create Google Maps Marker objects, and create a click-event
	* @constructor
	* listener for each.
	*/
	self.makeMarkers = function() {
		var markers = [];
		for (var i = 0; i < self.viennaList().length; i++) {
			self.viennaList()[i].marker = new google.maps.Marker({
				position: new google.maps.LatLng(self.viennaList()[i]
                    ['coordinates']['lat'],
                    self.viennaList()[i]['coordinates']['lng']),
				map: vm.map,
				title: self.viennaList()[i].name,
				summaryID: self.viennaList()[i].wikiPageID,
				id: i,
				url: self.viennaList()[i].wikiUrl
			});
			self.viennaList()[i].marker.addListener('click', function() {
				populateInfoWindow(this);
			});
		}
	};

	/**
	* @description Listens for any user changes to the content of the textbox
	* and upon any change, updates the markers on the map so that only those
	* matching the filter are displayed.
	*/
	self.userText.subscribe(function() {
		for (var k = 0; k < self.viennaList().length; k++ ) {
	        self.viennaList()[k].marker.setVisible(false);

		}
		//  Loop through 2 arrays, and compare all elements against each other
	   	for (var i = 0; i < self.newFilteredList().length; i++) {
			for (var j = 0; j < self.viennaList().length; j++ ) {
				//  Make marker visibile if it is visible in the List-View
				if (self.viennaList()[j].marker.summaryID
	                    === self.newFilteredList()[i].wikiPageID) {
	                self.viennaList()[j].marker.setVisible(true);

				}
			}
	   	}
	});
};


//  Create instance of ViewModel oject
var vm = new ViewModel();


//  Apply KnockoutJS bindings to the ViewModel instance vm
ko.applyBindings(vm);
