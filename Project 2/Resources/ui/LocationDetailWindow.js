// Location Detail Window

var util = require("/core/Utils"), 
	navigationBar = require("/ui/NavigationBar"), 
	flatButton = require("/ui/FlatButton"), 
	config = require("/core/Config"), 
	webview = require("/ui/WebView"), 
	theme = globals.theme, getHDHeight = function(width) {
	return Math.floor(width / 16 * 9);
};
//Creates location detail window
 
exports.create = function(location) {
	var window = Ti.UI.createWindow({
		title : location.name,
		navBarHidden : true,
		backgroundColor : "#000",
		layout : "vertical"
	}), backButton = Ti.UI.createImageView({
		height : theme.NavBar.buttonHeight,
		width : theme.NavBar.buttonWidth,
		image : theme.icons.back
	}), buttonView = Ti.UI.createView({
		height : 44,
		width : 44
	}), tilesWrapper = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL
	}), buttonTiles = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		layout : "horizontal"
	}), tileButtonOne = flatButton.create({
		label : L("directions"),
		backgroundColor : theme.LocationDetail.ButtonBackgroundColor,
		color : theme.LocationDetail.ButtonColor,
		font : theme.LocationDetail.ButtonFont,
		fontSize : theme.LocationDetail.ButtonFontSize,
		icon : theme.icons.map,
		width : "50%",
		height : "12%",
		eventData : {
			location : location
		},
		singleTap : tileButtonHandler
	}), tileButtonTwo = flatButton.create({
		label : L("Map"),
		backgroundColor : theme.LocationDetail.ButtonBackgroundColor,
		color : theme.LocationDetail.ButtonColor,
		font : theme.LocationDetail.ButtonFont,
		fontSize : theme.LocationDetail.ButtonFontSize,
		icon : theme.icons.pin,
		width : "50%",
		height : "12%",
		eventData : {
			location : location
		},
		singleTap : tileButtonHandler
	}), tileButtonThree = flatButton.create({
		label : L("save"),
		backgroundColor : theme.LocationDetail.ButtonBackgroundColor,
		color : theme.LocationDetail.ButtonColor,
		font : theme.LocationDetail.ButtonFont,
		fontSize : theme.LocationDetail.ButtonFontSize,
		icon : theme.icons.add,
		width : "50%",
		height : "12%",
		eventData : {
			location : location
		},
		singleTap : tileButtonHandler
	}), tileButtonFour = flatButton.create({
		label : L("mail"),
		backgroundColor : theme.LocationDetail.ButtonBackgroundColor,
		color : theme.LocationDetail.ButtonColor,
		font : theme.LocationDetail.ButtonFont,
		fontSize : theme.LocationDetail.ButtonFontSize,
		icon : theme.icons.mail,
		width : "50%",
		height : "12%",
		eventData : {
			location : location
		},
		singleTap : tileButtonHandler
	}), topShadow = util.createDropShadow(theme.Global.dropShadowColor), midShadow = util.createDropShadow(theme.Global.dropShadowColor), bottomShadow = util.createDropShadow(theme.Global.dropShadowColor, true), verticalSeperator = Ti.UI.createView({
		top : "2%",
		left : "50%",
		height : "20%",
		width : 1,
		backgroundColor : theme.LocationDetail.ButtonSeparatorColor
	}), horizontalSeperator = Ti.UI.createView({
		top : "12%",
		left : "7%",
		height : 1,
		width : "86%",
		backgroundColor : theme.LocationDetail.ButtonSeparatorColor
	}), hdHeight = getHDHeight(globals.width), ViewScrollr, imageView, slides = [], imageScrollr;

	function tileButtonHandler(e) {
		var url, mapIntent, location = e.data.location;

		switch(e.name) {
		case L("directions") :
			var currLocation = globals.currLocation.lat + "," + globals.currLocation.lon, destLocation = (location.latitude && location.longitude) ? location.latitude + "," + location.longitude : "0,0", address = location.street + "+" + location.city + "+" + location.state + "+" + location.zip, destination;

			destination = (destLocation === "0,0") ? address : destLocation;

			url = ((globals.iOS) ? "http://maps.apple.com/?saddr=" + currLocation + "&daddr=" + destination : "geo:" + destLocation + "?q=" + destination + "(" + location.name + ")"
			);

			if (globals.iOS) {
				if (Ti.Platform.canOpenURL(url)) {
					Ti.Platform.openURL(url);
				} else {
					Ti.UI.createAlertDialog({
						title : L("I\'m local"),
						message : L("directionsError")
					}).show();
				}
			} else {
				mapIntent = Ti.Android.createIntent({
					action : Ti.Android.ACTION_VIEW,
					data : url
				});
				Ti.Android.currentActivity.startActivity(mapIntent);
			}
			break;
		case L("Map") :
			url = "tel:" + location.phone;

			try {
				Ti.Platform.openURL(url);
				if (globals.iOS) {
					globals.navGroup.closeWindow(window);
				} else {
					window.close();
				}
			} catch(e) {
				Ti.UI.createAlertDialog({
					title : L("I\'m local"),
					message : L("phoneError")
				}).show();
			}
			break;
		case L("save") :
			var performAddressBookFunction = function() {
				var contact = {
					"organization" : location.name,
					"address" : {
						"work" : [{
							"CountryCode" : location.countryCode,
							"Street" : location.street,
							"City" : location.city,
							"County" : location.county,
							"State" : location.state,
							"Country" : location.country,
							"ZIP" : location.zip
						}]
					},
					"phone" : {
						"work" : [location.phone]
					}
				};

				Ti.Contacts.createPerson(contact);

				Ti.UI.createAlertDialog({
					title : L("I\'m local"),
					message : location.name + " " + L("contactAdded")
				}).show();
			};
			var addressBookDisallowed = function() {
				Ti.UI.createAlertDialog({
					title : L("I\'m local"),
					message : L("contactsError")
				}).show();
			};
			if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_AUTHORIZED) {
				performAddressBookFunction();
			} else if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_UNKNOWN) {
				Ti.Contacts.requestAuthorization(function(e) {
					if (e.success) {
						performAddressBookFunction();
					} else {
						addressBookDisallowed();
					}
				});
			}
			break;
		case L("mail") :
			var emailDialog = Ti.UI.createEmailDialog(), destLocation = (location.latitude && location.longitude) ? location.latitude + "," + location.longitude : "0,0", address = location.street + " " + location.city + ", " + location.state + " " + location.zip, url = "http://map.google.com/?q=" + ((destLocation !== "0,0") ? encodeURIComponent(destLocation) : encodeURIComponent(address));

			emailDialog.subject = L("shareEmailSubject");
			emailDialog.messageBody = L("shareEmailBody") + "\n\n" + location.name + ":\n" + url;
			emailDialog.open();
			break;
		}
	}

	if (!globals.iOS) {
		buttonView.left = 5;
		buttonView.top = 0;
	}

	var NavBar = navigationBar.create({
		text : location.name,
		leftButton : buttonView
	});

	buttonView.add(backButton);

	window.add(NavBar);

	if (location.images) {
		if (location.images instanceof Array) {
			ViewScrollr = require("/ui/ViewScrollrPro");

			for (var x = 0, l = location.images.length; x < l; x++) {
				slides.push({
					image : location.images[x]
				});
			}

			imageScrollr = ViewScrollr.create({
				width : globals.width,
				height : hdHeight,
				auto : config.images.autoScroll,
				scale : false,
				maxZoomScale : config.images.enableImageZoom ? 4.0 : 0,
				backgroundColor : config.images.backgroundColor,
				navigation : {
					onTop : false,
					style : (config.images.nav.displayAsBlocks) ? ViewScrollr.NAV_STYLE.BLOCK : ViewScrollr.NAV_STYLE.CIRCLE,
					selectedColor : config.images.nav.selectedColor,
					color : config.images.nav.color,
					showBorder : config.images.nav.border,
					borderColor : config.images.nav.borderColor,
					backgroundColor : config.images.nav.backgroundColor
				},
				slides : slides
			});

			imageScrollr.add(topShadow);
			imageScrollr.add(bottomShadow);
			window.add(imageScrollr);
			imageScrollr.$.start();
		} else {
			var container = Ti.UI.createScrollView({
				backgroundColor : config.images.backgroundColor,
				width : globals.width,
				height : hdHeight,
				maxZoomScale : config.images.enableImageZoom ? 4.0 : 1
			}), imageView = Ti.UI.createImageView({
				enableZoomControls : config.images.enableImageZoom,
				image : location.images,
				width : globals.width,
				height : hdHeight
			});
			container.add(imageView);
			container.add(topShadow);
			container.add(bottomShadow);
			window.add(container);
		}
	}

	buttonTiles.add(tileButtonOne);
	buttonTiles.add(tileButtonTwo);
	buttonTiles.add(tileButtonThree);
	buttonTiles.add(tileButtonFour);

	tilesWrapper.add(buttonTiles);
	tilesWrapper.add(verticalSeperator);
	tilesWrapper.add(horizontalSeperator);

	window.add(require("/ui/AddressBar").create(location));
	window.add(midShadow);
	window.add(tilesWrapper);

	backButton.addEventListener("click", function() {
		// Open Location Detail Window
		if (globals.iOS) {
			globals.navGroup.closeWindow(window);
		} else {
			window.close();
		}
	});

	return window;
}; 