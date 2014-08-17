// Location Window
var LocationManager = require("/core/LocationManager"),
	LocationDetailWindow = require("/ui/LocationDetailWindow"),
	locationRow = require("/ui/LocationRow"),
	util = require("/core/Utils"),
	config = require("/core/Config"),
	theme = globals.theme,
	navBarVisible = false,
	googMap = require("/ui/GoogleMap"),
	webview = require("/ui/WebView"),
	navigationBar = require("/ui/NavigationBar"),
	locations,
	undef;

function locationSetup(){
	if(globals.iOS){
		Ti.Geolocation.purpose = config.GPS_Purpose;
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		Ti.Geolocation.distanceFilter = 20;
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
	}
	else{
		var providerGps = Ti.Geolocation.Android.createLocationProvider({
			    name : Ti.Geolocation.PROVIDER_GPS,
			    minUpdateDistance : 0.0,
			    minUpdateTime : 0
			});
		Ti.Geolocation.Android.addLocationProvider(providerGps);
		Ti.Geolocation.Android.manualMode = false;
	}

}

function enableLocation(){
	if(config.isSimulator){
		Ti.App.fireEvent(
			globals.events.CurrentLocation,
			{
				"data" : {
					"latitude" : 40.76812671,
					"longitude" : -73.98133278
				}
			}
		);	
	}
	else{
		if(Ti.Geolocation.locationServicesEnabled) {
			Ti.Geolocation.addEventListener("location", function(e) {
				if(!e.success || e.error){
					Ti.UI.createAlertDialog({
						title : L("I\'m local"),
						message : L("enableLocation")
					}).show();
				}
				else{
					Ti.App.fireEvent(
						globals.events.CurrentLocation,
						{ "data" : e.coords }
					);
				}
			});
		}
		else{
			Ti.UI.createAlertDialog({
				title : L("I\'m local"),
				message : L("enableLocation")
			}).show();	
		}
	}
}

function checkLocationAuth(){
	var authorization = Ti.Geolocation.locationServicesAuthorization;

	if (authorization == Ti.Geolocation.AUTHORIZATION_DENIED) {
		Ti.UI.createAlertDialog({
			title : L("I\'m local"),
			message : L("userDisabledLocation")
		}).show();
		return false;
	}
	else if (authorization == Ti.Geolocation.AUTHORIZATION_RESTRICTED) {
		Ti.UI.createAlertDialog({
			title : L("I\'m local"),
			message : L("systemDisabledLocation")
		}).show();
		return false;
	}
	return true;
}

function getDistance(lat1, lon1, lat2, lon2){
	// convert degrees to radians
	function toRad(num){ return num * Math.PI / 180; }
	// convert radians to degrees
	function toDeg(num){ return num * 180 / Math.PI; }

	var a = 6378137, b = 6356752.314245, f = 1/298.257223563, // WGS-84 ellipsoid params
		L = toRad(lon2-lon1),
		U1 = Math.atan((1-f) * Math.tan(toRad(lat1))),
		U2 = Math.atan((1-f) * Math.tan(toRad(lat2))),
		sinU1 = Math.sin(U1), cosU1 = Math.cos(U1),
		sinU2 = Math.sin(U2), cosU2 = Math.cos(U2),
		lambda = L, lambdaP, iterLimit = 100;

	do{
		var sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda),
			sinSigma = Math.sqrt((cosU2*sinLambda) * (cosU2*sinLambda) + 
	    				(cosU1*sinU2-sinU1*cosU2*cosLambda) * (cosU1*sinU2-sinU1*cosU2*cosLambda));

		if (sinSigma==0){ return 0; } // co-incident points

		var cosSigma = sinU1*sinU2 + cosU1*cosU2*cosLambda,
			sigma = Math.atan2(sinSigma, cosSigma),
			sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma,
			cosSqAlpha = 1 - sinAlpha*sinAlpha,
			cos2SigmaM = cosSigma - 2*sinU1*sinU2/cosSqAlpha;

		if (isNaN(cos2SigmaM)){ cos2SigmaM = 0; }  // equatorial line: cosSqAlpha=0 (§6)
		var C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));

		lambdaP = lambda;
		lambda = L + (1-C) * f * sinAlpha *
					(sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));
	}
	while( Math.abs(lambda-lambdaP) > 1e-12 && --iterLimit>0 );

	if (iterLimit==0){ return NaN; }  // formula failed to converge

	var uSq = cosSqAlpha * (a*a - b*b) / (b*b),
		A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq))),
		B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq))),
		deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
						B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM))),
		s = b*A*(sigma-deltaSigma);

	s = s.toFixed(3); // round to 1mm precision
	return s;
}

//create location window
exports.create = function(){
	var window = Ti.UI.createWindow({
			exitOnClose : true,
			title : L("I\'m local"),
			navBarHidden : true,
			backgroundColor : theme.Global.backgroundColor
		}),
		topShadow = util.createDropShadow(theme.Global.dropShadowColor),
		bottomShadow = util.createDropShadow(theme.Global.dropShadowColor, true),
		isFullScreen = false,
		googMapView = googMap.create(),
		bgView = Ti.UI.createView({
			top : 3,
			opacity : theme.Global.opacity,
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			backgroundColor : theme.LocationRow.backgroundColor
		}),
		tableContainer = Ti.UI.createView({
			top : "100%",
			height : "40%"
		}),
		locationsTable = Ti.UI.createTableView({
			top : 3,
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			separatorColor : theme.Global.separatorColor,
			backgroundColor : "transparent"
		}),
		fullScreenButton = Ti.UI.createImageView({
			image : theme.icons.expand,
			visible : false,
			height : theme.NavBar.buttonHeight,
			width : theme.NavBar.buttonWidth
		}),
		infoButton = Ti.UI.createImageView({
			image : theme.icons.info,
			height : theme.NavBar.buttonHeight,
			width : theme.NavBar.buttonWidth
		}),
		midScreenButton = Ti.UI.createImageView({
			image : theme.icons.collapse,
			visible : false,
			height : theme.NavBar.buttonHeight,
			width : theme.NavBar.buttonWidth
		}),
		rightButtonView = Ti.UI.createView({
			height : 44,
			width : 44
		}),
		leftButtonView = Ti.UI.createView({
			height : 44,
			width : 44
		}),
		i, len;

	var NavBar = navigationBar.create({
		text : Ti.App.name,
		leftButton : leftButtonView,
		rightButton : rightButtonView
	});

	rightButtonView.add(fullScreenButton);
	rightButtonView.add(midScreenButton);

	if(config.webviews.info){
		leftButtonView.add(infoButton);
		infoButton.addEventListener( "click", loadInfoScreen);
	}

	bottomShadow.bottom = undef;
	bottomShadow.top = 0;
	topShadow.top = 44;

	tableContainer.add(bgView);
	tableContainer.add(locationsTable);
	tableContainer.add(bottomShadow);
	
	window.add(googMapView);
	window.add(NavBar);
	window.add(tableContainer);

	function fullScreen(){
		fullScreenButton.hide();
		midScreenButton.show();
		tableContainer.animate( { top : "100%", duration : 400 } );
		isFullScreen = false;
	}

	function midScreen(){
		midScreenButton.hide();
		fullScreenButton.show();
		tableContainer.animate( { top : "60%", duration : 400 } );
		isFullScreen = true;
	}

	function loadInfoScreen(){
		if (globals.iOS) {
			globals.navGroup.openWindow(webview.create(L("info"), config.webviews.info));
		}
		else{
			webview.create(L("info"), config.webviews.info).open();
		}
	}

	function displayLocations(){
			var rows = [],
				row, x, l, val, converted,
				distanceType, aLocation;

			locations = LocationManager.get();

			for(i=0, len=locations.length; i<len; i++){
				aLocation = locations[i];
				row = locationRow.create(aLocation);

				if(globals.currLocation.lat!=0){
					val = getDistance(
						aLocation.latitude,
						aLocation.longitude,
						globals.currLocation.lat,
						globals.currLocation.lon
					);
					row.$.saveDistance(val);
					converted = (config.use_miles) ? val * 0.000621371192 : val/1000;
					distanceType = (config.use_miles) ? " mi" : " km";

					//row.$.updateDistance(Math.round(converted) + distanceType);
					row.$.updateDistance(converted.toFixed(1) + distanceType);
				}

				rows.push(row);
			}

			rows.sort(function(a,b){
				return a.$.getDistance()-b.$.getDistance();
			});

			locationsTable.setData(rows);
	}

	fullScreenButton.addEventListener( "click", fullScreen );
	midScreenButton.addEventListener( "click", midScreen );

	NavBar.top = -44;
	window.addEventListener(
		"open",
		function(){
			if (Ti.Geolocation.locationServicesEnabled) {
				locationSetup();

				if(globals.iOS){
					if(checkLocationAuth()){
						enableLocation();
					}
					else{
						displayLocations();
					}
				}
				else{
					enableLocation();
				}
				
			}
			else {
				Ti.UI.createAlertDialog({
					title : L("I\'m local"),
					message : L("enableLocation")
				}).show();
			}

			setTimeout(function(){
				midScreen();
				NavBar.animate(
					{ top : 0, duration : 400 },
					function(){
						window.add(topShadow);
						navBarVisible = true;
					}
				);
			}, 1500);
		}
	);

	Ti.App.addEventListener(
		globals.events.CurrentLocation,
		function(e){
			globals.currLocation.lat = e.data.latitude;
			globals.currLocation.lon = e.data.longitude;
			displayLocations();
		}
	);


	Ti.App.addEventListener(
		"GoogleMapHTML::STREET_VIEW_VISIBLE",
		function(e){
			if(e.visible && navBarVisible){
				topShadow.hide();
				NavBar.animate(
					{ top : -44, duration : 400 },
					function(){
						navBarVisible = false;
					}
				);
				fullScreen();
			}
			else{
				NavBar.animate(
					{ top : 0, duration : 400 },
					function(){
						topShadow.show();
						navBarVisible = true;
					}
				);
				midScreen();
			}
		}
	);

	Ti.App.addEventListener(
		"GoogleMapHTML::LOAD_LOCATION_DETAIL",
		function(e){
			var loc = e.location.location;
			// Open Location Detail Window
			if (globals.iOS) {
				globals.navGroup.openWindow(LocationDetailWindow.create(loc));
			}
			else{
				LocationDetailWindow.create(loc).open();
			}
		}
	);

	return window;
};