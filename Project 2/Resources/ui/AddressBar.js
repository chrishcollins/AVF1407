var theme = globals.theme;

 //Creates a address  component.
 
exports.create = function(location){
	var addr1Lbl = Ti.UI.createLabel({
			top : 4,
			text : location.street || "",
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			color : theme.AddressBar.color,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			opacity : 1,
			font : {
				fontFamily : theme.AddressBar.font,
				fontSize : theme.AddressBar.fontSize
			}
		}),
		addr2Lbl = Ti.UI.createLabel({
			text : location.city + ", " + location.state + " " + location.zip,
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			color : theme.AddressBar.color,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			opacity : 1,
			font : {
				fontFamily : theme.AddressBar.font,
				fontSize : theme.AddressBar.fontSize
			}
		}),
		phoneLbl = Ti.UI.createLabel({
			text : location.phone || "",
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			color : theme.AddressBar.color,
			bottom : 4,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontFamily : theme.AddressBar.font,
				fontSize : theme.AddressBar.fontSize
			}
		}),
		view = Ti.UI.createView({
			backgroundColor : theme.AddressBar.backgroundColor,
			opacity : theme.Global.opacity,
			width  : Ti.UI.FILL,
			height : Ti.UI.SIZE
		}),
		labelView = Ti.UI.createView({
			height : Ti.UI.SIZE,
			right : 4,
			left : 4,
			layout : "vertical"
		});

	labelView.add(addr1Lbl);
	labelView.add(addr2Lbl);
	labelView.add(phoneLbl);

	view.add(labelView);

	return view;
};
