# Vienna Destinations Web App

**Vienna Destinations Web App** is a project that displays my favorite
vacation destinations in Vienna on a custom
[Google Map](https://www.google.com/maps), and provides some information about
each retrieved from [Wikipedia's](https://www.wikipedia.org) API when
corresponding page elements are clicked. The
[KnockoutJS](http://knockoutjs.com/) framework is used for organization and
storing information about the destinations, and other page features.

## Setup:
Begin the setup by making sure you have an active Internet connection, and
cloning all files from GitHub to the same local directory.

##### If wanting to deploy your this application with your own city / locations, you'll need to:
* Obtain a [Google Maps API key](https://developers.google.com/maps/documentation/embed/get-api-key)
* Rename the Knockout Observable Array ```self.ViennaList``` in the ViewModel
to be more appropriate to your project, and populate it with a location array
of your own.
* Set the initial longitude, latitude, and zoom level in the ```initMap()```
function, to properly display your location(s) when the WebApp is loaded in
the browser.
* Re-work the Wikipedia API calls to work with your data

Detailed documentation of the Google Maps Javascript API can be found here:
[Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/)

Wikipedia's API is documented here: [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page)

## Usage:

To begin using this WebApp, make sure all files are in the same local directory
and that you have an active Internet connection. Open ```index.html``` in your
favorite Internet browser, and the WebApp will load. It will display vacation
destinations in Vienna on a custom Google Map, and in a list on the left-hand
side. On mobile browsers the list will be hidden, and accessible through a
hamburger menu in the top left corner of the browser.

##### Interactivity:
When the map marker, or name in left-hand menu is clicked an **Info-Window**
will pop up, and display information about that location. A user may filter
the list and markers based on their input to the text-box also located in the
left-hand menu. Both markers and list-items will be filtered out if the
user-entered text doesn't appear within a locations name.

## Attribution:

This project was created while I was taking the Udacity Full-Stack Nanodegree,
and significant chunks of the structure / ideas behind the structure were
provided by the course author. Significant portions of this project were
inspired directly from the Udacity course "The Frontend: Javascript & AJAX",
Lesson 7 "Getting Started with API's". For my hamburger menu implementation I
drew heavily from the course / example in "Programming Fundamentals",
Lesson 21 "Common Responsive Patterns", Segment 9 "Pattern - Off Canvas".
Heavy usage was made of information from the Google Maps, and Wikipedia APIs.
Also, Udacity mentors Karol Zyskowski and Tamás Krasser helped me
trouble-shoot quite a few issues.


## License:

**Vienna Destinations Web App** is a public domain work, with license
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
