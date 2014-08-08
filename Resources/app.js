Ti.UI.setBackgroundColor('#000');

var mainWin = Ti.UI.createWindow({
	//url: 'weather.js'
});

var mainView = Ti.UI.createScrollView({
	backgroundImage: "images/BlueSky.jpg",
	showVerticalScrollIndicator: true
});

var needWeather = require('weather');
mainWin.add(mainView);
mainWin.open();
