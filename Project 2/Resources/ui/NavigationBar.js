//Navigation bar

var theme = globals.theme;

function getTitleLabel(titleText){
	var TitleLabel = Ti.UI.createLabel({
			text : titleText,
			height : 44,
			left : 50,
			right : 50,
			top : 0,
			color : theme.NavBar.color,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			wordWrap : false,
			font : {
				fontFamily : theme.NavBar.font,
				fontSize : theme.NavBar.fontSize,
				fontWeight : theme.NavBar.fontWeight
			}
		});
	return TitleLabel;
}

function getTitleLogo(image){
	var TitleImage = Ti.UI.createImageView({
			image : image,
			height : "44",
			width : Ti.UI.SIZE
		}),
		container = Ti.UI.createView({
			left : 50,
			right : 50,
			top : 0
		});
	container.add(TitleImage);
	return container;
}

/**
 * @method create
 * Creates navigation bar (like navBar on iOS).
 * @param {Object} settings Settings for navigation bar (title, buttons, etc...)
 * @return {Ti.UI.View}
 *
 */
exports.create = function(settings){
	var TitleLabel = (settings.image) ? getTitleLogo(settings.image) : getTitleLabel(settings.text),
		container = Ti.UI.createView({
			top : 0,
			width : Ti.UI.FILL,
			height : 44
		}),
		FlexSpace, navBar, navBarItems;

	if(globals.iOS){
		FlexSpace = Ti.UI.createButton({
			systemButton : Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});

		navBarItems = [];

		if(settings.leftButton){
			navBarItems.push(settings.leftButton);
		}

		navBarItems.push(FlexSpace);

		if(settings.rightButton){
			navBarItems.push(settings.rightButton);
		}
		
		navBar = Ti.UI.iOS.createToolbar({
			barColor : theme.Global.backgroundColor,
			opacity : theme.Global.opacity,
			top : 0,
			items : navBarItems
		});
	}
	else{
		navBar = Ti.UI.createView({
			top : -1,
			left : -1,
			right : -1,
			height : 45,
			backgroundColor : theme.Global.backgroundColor
		});

		if(settings.leftButton){
			//settings.leftButton.backgroundColor = "#0f0";
			settings.leftButton.left = 5;
			settings.leftButton.top = 0;
			navBar.add(settings.leftButton);
		}

		if(settings.rightButton){
			//settings.rightButton.backgroundColor = "#00f";
			settings.rightButton.right = 5;
			settings.rightButton.top = 0;
			navBar.add(settings.rightButton);
		}
	}

	container.add(navBar);
	container.add(TitleLabel);

	return container;
};