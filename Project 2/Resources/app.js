
var globals = require("/core/globals");

(function(){
	var config = require("/core/Config"),
		AppWindow, LocationManager, locationsHandler;

	globals.theme = require("/themes/" + config.theme);
	LocationManager = require("/core/LocationManager");

	Titanium.UI.backgroundColor = globals.theme.Global.backgroundColor;

	locationsHandler = function(e){
		AppWindow = require("/ui/AppWindow").create();
		AppWindow.open();
		Ti.App.removeEventListener(
			LocationManager.events.LOCATIONS_READY,
			locationsHandler
		);
	};

	Ti.App.addEventListener(
		LocationManager.events.LOCATIONS_READY,
		locationsHandler
	);

	// Load locations
	LocationManager.load();
	
})();
