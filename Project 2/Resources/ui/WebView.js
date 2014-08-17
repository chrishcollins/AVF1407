var 
	config = require("/core/Config"),
	util = require("/core/Utils"),
	theme = globals.theme,
	navigationBar = require("/ui/NavigationBar");

exports.create = function(title, url, isBrowser){
	if(isBrowser){
		var urlArr = url.split("://");
		if (urlArr.length>1){
			title = urlArr[1];
		}
		else{
			title = urlArr[0];
		}
	}

	var window = Ti.UI.createWindow({
			navBarHidden : true,
			backgroundColor : "#fff"
		}),
		webview = Ti.UI.createWebView({
			top : 44,
			bottom : 0,
			left : 0,
			right : 0,
			backgroundColor : "transparent",
			visible : false,
			scalesPageToFit : false,
			url : url
		}),
		backButton = Ti.UI.createImageView({
			height : theme.NavBar.buttonHeight,
			width : theme.NavBar.buttonWidth,
			image : theme.icons.back
		}),
		leftButtonView = Ti.UI.createView({
			height : 44,
			width : 44
		}),
		rightButtonView = Ti.UI.createView({
			height : 44,
			width : 44
		}),
		navBar = navigationBar.create({
			text : title,
			leftButton : leftButtonView,
			rightButton : rightButtonView
		}),
		topShadow = util.createDropShadow(theme.Global.dropShadowColor),
		LoadingIndicator = require('/ui/Indicator');

	leftButtonView.add(backButton);

	topShadow.top = 44;

	window.add(navBar);
	window.add(webview);
	window.add(topShadow);

	leftButtonView.addEventListener(
		"click",
		function(){
			if (globals.iOS) {
				globals.navGroup.closeWindow(window);
			}
			else{
				window.close();
			}
		}
	);

	window.addEventListener(
		"focus",
		setInfoHTML
	);
	webview.addEventListener(
		"beforeload",
		function(){
			LoadingIndicator.show();
		}
	);
	webview.addEventListener(
		"load",
		function(){
			LoadingIndicator.hide();
		}
	);

	function setInfoHTML(){
		window.add(webview);
		webview.show();
	}

	return window;
};