// Location Table Row

var LocationDetailWindow = require("/ui/LocationDetailWindow"),
	config = require("/core/Config"),
	theme = globals.theme;

 // Creates a location table row component.
 
exports.create = function(location){
	var row = Ti.UI.createTableViewRow({
			hasChild : true,
			height : Ti.UI.SIZE,
			selectedBackgroundColor : theme.LocationRow.selectedBackgroundColor,
			backgroundColor : "transparent"
		}),
		view = Ti.UI.createView({
			width  : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			layout : "vertical" 
		}),
		bottom = Ti.UI.createView({
			width  : Ti.UI.FILL,
			height : 4
		}),
		nameLbl = Ti.UI.createLabel({
			top : 2,
			left : 12,
			text : location.name || "",
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			color : theme.LocationRow.color,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			font : {
				fontFamily : theme.LocationRow.headerFont,
				fontSize : theme.LocationRow.headerFontSize,
				fontWeight : theme.LocationRow.headerFontWeight
			}
		}),
		addr1Lbl = Ti.UI.createLabel({
			left : 12,
			text : location.street || "",
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			color : theme.LocationRow.color,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			font : {
				fontFamily : theme.LocationRow.font,
				fontSize : theme.LocationRow.fontSize
			}
		}),
		addr2Lbl = Ti.UI.createLabel({
			left : 12,
			text : location.city + ", " + location.state + " " + location.zip,
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			color : theme.LocationRow.color,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			font : {
				fontFamily : theme.LocationRow.font,
				fontSize : theme.LocationRow.fontSize
			}
		}),
		distance = Ti.UI.createLabel({
			width  : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			text   : "",
			color  : theme.LocationRow.distanceColor,
			right  : 4,
			font   : {
				fontFamily : theme.LocationRow.distanceFont,
				fontSize : theme.LocationRow.distanceFontSize
			}
		}),
		distanceVal = 0;

	view.add(nameLbl);
	view.add(addr1Lbl);
	view.add(addr2Lbl);
	view.add(bottom);

	row.add(view);
	row.add(distance);

	row.addEventListener(
		"click",
		function(e){
			// Open Location Detail Window
			if (globals.iOS) {
				globals.navGroup.openWindow(LocationDetailWindow.create(location));
			}
			else{
				LocationDetailWindow.create(location).open();
			}
		}
	);

	row.$ = {
		"saveDistance" : function(val){
			distanceVal = val;
		},
		"getDistance" : function(){
			return distanceVal;
		},
		"updateDistance" : function(text){
			distance.text = text;
		}
	};
	
	return row;
};