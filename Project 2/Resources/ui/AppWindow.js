// Application TabGroup

var LocationWindow = require("/ui/LocationWindow");


 // Creates the main application tab group
 
exports.create = function() {
	
	if(globals.iOS){
		var Window = globals.navGroup = Ti.UI.iOS.createNavigationWindow({
			top    : globals.top,
			window : LocationWindow.create()
		});
	}
	else{
		var Window = LocationWindow.create();
	}

	return Window;
};