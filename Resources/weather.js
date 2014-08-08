var myWeather = 'http://api.wunderground.com/api/c8aa6df478360a59/forecast/q/autoip.json';


// Create an ImageView.
var appNameView = Ti.UI.createImageView({
	image : 'images/weather.png',
	width : '60%',
	height : '14%',
	top : '5%',
	left : '20%'
});



var remoteResponse = function(e) {
	if (Ti.Network.online) {
		var json = JSON.parse(this.responseText);

		var currentTemp = json.forecast.simpleforecast.forecastday[0].high.fahrenheit;
		var day = json.forecast.txt_forecast.forecastday[0].title;
		var forecast = json.forecast.txt_forecast.forecastday[0].fcttext;
		var weatherImage = json.forecast.txt_forecast.forecastday[0].icon_url;
			
		
		var postDay = Ti.UI.createLabel({
				text : day,
				font : {
				fontSize : 30,
				fontWeight : 'bold'
			},
				color : '#fff',
				top : '25%',
				textAlign: 'center'
			});
			
			var dayTemp = Ti.UI.createLabel({
			text : currentTemp + ' °',
			color : '#fff',
			top : '35%',
			font : {
				fontSize : 20,
				fontWeight : 'thin'
			},
			textAlign: 'center'
		});

			var postImage = Ti.UI.createImageView({
				image : weatherImage,
				backgroundColor: '#fff',
				borderRadius: 5,
				top : '40%',
				height: '7%',
				width: '10%',
				left : '45.5%',
				imageAlign: 'center'
			});
			
			var postForecast = Ti.UI.createLabel({
			 text : forecast,
			 font : {
				fontSize : 30,
				fontWeight : 'bold'
			},
			 color : '#fff',
			 top : '50%',
			 textAlign: 'center',
			 width : '90%'
			 });

			mainView.add(postImage);
			mainView.add(postDay);
			mainView.add(postForecast);
			mainView.add(dayTemp);
			mainView.add(appNameView);
		

	} else {
		Ti.API.debug('Status: ' + this.status);
		Ti.API.debug('Response: ' + this.responseText);
		Ti.API.debug('Error: ' + e.error);
		alert('There was an error retreiving data.  Please try again later.');

	};
};


// Create a Button.
var refresh = Ti.UI.createButton({
	title : 'Refresh',
	backgroundColor: '#fff',
	borderColor: 'blue',
	borderRadius: 5,
	height : '5%',
	width : '20%',
	top : '92%',
	left : '40%'
});

// Listen for click events.
refresh.addEventListener('click', function() {
	alert('Checking for a network connection.');
});

// Add to the parent view.
mainView.add(refresh);

var remoteError = function(e) {
	Ti.API.debug('Status: ' + this.status);
	Ti.API.debug('Response: ' + this.responseText);
	Ti.API.debug('Error: ' + e.error);
	alert('You must be connected to a network.');
};
var xhr = Ti.Network.createHTTPClient({
	onload : remoteResponse,
	onerror : remoteError,
	timeout : 50000
});
xhr.open('GET', myWeather);
xhr.send();

