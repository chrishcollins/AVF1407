var config = require("/core/Config"),
//compass = require("/ui/compass"),
util = require("/core/Utils"), LocationManager = require("/core/LocationManager"), browser = require("/ui/WebView"), locations = LocationManager.get(), theme = globals.theme, annotations = [], mapHTML = "/html/map.html", externalUrl = "", annotationParams, aLocation, annotation;

exports.create = function(options) {
	var options = options || {}, webview = Ti.UI.createWebView({
		top : options.top || 0,
		bottom : options.bottom || 0,
		left : options.left || 0,
		right : options.right || 0,
		backgroundColor : options.backgroundColor || "#fff",
		scalesPageToFit : false,
		url : mapHTML
	});

	function init(aLocation) {
		annotationParams = {
			latitude : aLocation.latitude,
			longitude : aLocation.longitude,
			title : aLocation.name,
			location : aLocation
		};

		annotations.push(annotationParams);
	}


	webview.addEventListener("beforeload", function(e) {
		if (!Ti.Network.getOnline()) {
			Ti.UI.createAlertDialog({
				title : L("I\'m local"),
				message : L("googleMapError")
			}).show();
			return;
		}

		if (e.url.indexOf(mapHTML) < 0 && externalUrl != e.url) {
			webview.stopLoading();
			externalUrl = e.url;
			if (globals.iOS) {
				globals.navGroup.openWindow(browser.create("", externalUrl, true));
			} else {
				browser.create("", externalUrl, true).open();
			}
		} else {
			externalUrl = "";
		}
	});

	webview.addEventListener("load", function() {
		if (globals.currLocation.lat && globals.currLocation.lon) {
			Ti.App.fireEvent("GoogleMap::CURRENT_LOCATION_READY", {
				lat : globals.currLocation.lat,
				lon : globals.currLocation.lon,
				mapType : config.MapType,
				zoom : config.MapZoom,
				apiKey : config.GoogleMapAPIKey
			});
		} else {
			Ti.App.addEventListener(globals.events.CurrentLocation, function(e) {
				Ti.App.fireEvent("GoogleMap::CURRENT_LOCATION_READY", {
					lat : e.data.latitude,
					lon : e.data.longitude,
					mapType : config.MapType,
					zoom : config.MapZoom,
					apiKey : config.GoogleMapAPIKey
				});
			});
		}

		for (var x = 0, len = locations.length; x < len; x++) {
			init(locations[x]);
		}

		Ti.App.fireEvent("GoogleMap::LOCATION_MARKERS_READY", {
			markers : annotations
		});
	});

	webview.addEventListener("error", function(e) {
		Ti.API.error(e.error);
		Ti.UI.createAlertDialog({
			title : L("I\'m Local"),
			message : L("googleMapError")
		}).show();
	});

	return webview;
}; 