// Location Manager

var utils = require("/core/Utils"),
	config = require("/core/Config"),
	LOCATIONS_READY = "LocationManager::LOCATIONS_READY",
	Cache = Ti.App.Properties.getList("locations", false),
	defaultLocationsFile = "/data/locations.json",
	jsonFile;

function isValidURL(str) {
	if(typeof str!=="string"){ return false; }
	return (/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/).test(str);
}

// Load Locations from filesystem
function getAppLocationsFile(callback){
	var file = defaultLocationsFile;

	if(!isValidURL(config.Locations)){
		file = config.Locations;
	}

	try{
		jsonFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, file);
		Cache = (JSON.parse(jsonFile.read().text)).locations;
		if(callback){ callback(); }
	}
	catch(e){
		Ti.API.warn("Can't load Locations from filesystem");
	}	
}

function getLatLon(addr, callback){
	Ti.Geolocation.forwardGeocoder(
		addr,
		function(e){
			var coords = [e.latitude, e.longitude];
			if(callback){
				callback({coords : coords});
			}
		}
	);
}

function checkLocations(){
	var tempObj=[],
	    lookupCount=0,
	    len=Cache.length,
	    loopCount = len*1; // make sure is copy (not reference to len)

	for(var x=0;x<len;x++){
		aLocation = Cache[x];
		if(!aLocation.latitude || !aLocation.longitude){
			tempObj.push(x*1); //used to track which location to update
			getLatLon(
				aLocation.street + ", " + aLocation.city + ", " + aLocation.state + " " + aLocation.zip,
				function(obj){
					var loc = Cache[tempObj[lookupCount]];
					loc.latitude = obj.coords[0];
					loc.longitude = obj.coords[1];
					lookupCount++;
					loopCount--;
					if(loopCount==0){
						Ti.App.fireEvent(LOCATIONS_READY);
					}
				}
			);
		}
		else{
			loopCount--;
			if(loopCount==0){
				Ti.App.fireEvent(LOCATIONS_READY);
			}
		}
	}
};

// load locations from filesystem (if exist)
getAppLocationsFile();

exports.load = function(){
	if(isValidURL(config.Locations)){
		utils.fetch(
			config.Locations,
			function(data){
				if(!data && Cache){
					Ti.App.fireEvent(LOCATIONS_READY);
					return;
				}
				else if(!data){
					Ti.UI.createAlertDialog({
						title : L("I\'m local"),
						message : L("locationDataError")
					}).show();
					return;
				}
				Ti.App.Properties.setList("locations", data.locations);
				Cache = data.locations;
				checkLocations();
			},
			3
		);
	}
	else{
		getAppLocationsFile(function(){ 
			checkLocations(); 
			});
	}
};

exports.get = function(indx){
	if(typeof indx=="number"){
		return Cache[indx];
	}
	else{
		return Cache;
	}
};

exports.events = {
	"LOCATIONS_READY" : LOCATIONS_READY
};
