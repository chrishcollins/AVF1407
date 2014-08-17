/*var runCompass = Ti.Geolocation.getCurrentHeading(function(e){
	var trueHeading = e.heading.trueHeading;
	var compassLabel = Ti.UI.createLabel({
		color: '#fff',
		text: 'True Heading: ' + trueHeading,
		height: Ti.UI.SIZE,
		textAlign: 'center',
		font: {
			fontSize: '20dp',
			fontWeight: 'bold'
		}
	});
	myView.add(compassLabel);
});
Ti.Geolocation.addEventListener('heading', runCompass);


Ti.Geolocation.getCurrentHeading(function(e) {
 
if (e.error)
    {
        currentHeading.text = 'error: ' + e.error;
        return;
    }
var x = e.heading.x;
var y = e.heading.y;
var z = e.heading.z;
var magneticHeading = e.heading.magneticHeading;
var accuracy = e.heading.accuracy;
var trueHeading = e.heading.trueHeading;
var timestamp = e.heading.timestamp; currentHeading.text = 'x:' + x + ' y: ' + y + ' z:' + z;
Titanium.API.info('geo - current heading: ' + new Date(timestamp) + ' x ' + x + ' y ' + y + ' z ' + z);
*/