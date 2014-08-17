//Configuration

module.exports = {
	"isSimulator" : false, //Set to true if testing in simulator

	"theme" : "default",
	"Locations" : "/data/locations.json",
	"GPS_Purpose" : "Find Nearest Store",
	"GoogleMapAPIKey" : "AIzaSyCRiXpgqiUNQ1s87D2DPVUYDH-gmwcrwHA",
	"MapZoom" : 13,
	"MapType" : "HYBRID",
	"use_miles" : true,

	// Configuration for location detail image gallery (ViewScrollr)
	"images" : {
		"autoScroll" : false,
		"backgroundColor" : "#000",
		"enableImageZoom" : true,
		"nav" : {
			"selectedColor" : "#000",
			"color" : "#eee",
			"border" : true,
			"borderColor" : "#000",
			"backgroundColor" : "transparent",
			"displayAsBlocks" : false
		}
	},
	// Webview urls here
	"webviews" : {
		//"info" : "http://www.fullsail.edu/degrees/online/mobile-development-bachelors"
	}
};