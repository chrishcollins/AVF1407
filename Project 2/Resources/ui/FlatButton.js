// Flat Button
var theme = globals.theme;

exports.create = function(options) {
	var view = Ti.UI.createView({
		width : options.width,
		height : options.height,
		backgroundColor : options.backgroundColor
	}), iconWrapper = Ti.UI.createView({
		width : Ti.UI.SIZE
	}), icon = Ti.UI.createImageView({
		width : theme.LocationDetail.ActionButtonIconWidth,
		height : theme.LocationDetail.ActionButtonIconHeight,
		image : options.icon
	}), label = Ti.UI.createLabel({
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		text : options.label,
		color : options.color,
		font : {
			fontFamily : options.font,
			fontSize : options.fontSize
		}
	});

	if (options.horizontal) {
		view.applyProperties({
			layout : "horizontal"
		});
		iconWrapper.applyProperties({
			height : Ti.UI.SIZE
		});
		icon.left = "3%";
		label.textAlign = Ti.UI.TEXT_ALIGNMENT_LEFT;
	} else {
		view.applyProperties({
			layout : "vertical"
		});
		iconWrapper.applyProperties({
			height : "60%"
		});
		icon.bottom = "3%";
		label.textAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;
	}

	iconWrapper.add(icon);
	view.add(iconWrapper);
	view.add(label);

	view.addEventListener("singletap", function(e) {
		e.cancelBubble = true;
		options.singleTap({
			"name" : options.label,
			"data" : options.eventData || {}
		});
	});

	return view;
}; 