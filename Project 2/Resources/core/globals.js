var 
    densityFactor = (Ti.Platform.osname === "android") ? Ti.Platform.displayCaps.logicalDensityFactor : 1,
    osName = Ti.Platform.osname,
    version = Ti.Platform.version,
    major = parseInt(version.split(".")[0],10),
    platformHeight = Ti.Platform.displayCaps.platformHeight,
    platformWidth = Ti.Platform.displayCaps.platformWidth,
    iOS7 = (Ti.Platform.name == "iPhone OS" && major >= 7) ? true : false;

//Global variables
module.exports = {
	"osname" : osName,
	"iOS" : osName === "iphone" || osName === "ipad",
	"iOS7" : iOS7,
	"top" : iOS7 ? 20 : 0,
	"height" : Math.floor(platformHeight/densityFactor),
	"width" : Math.floor(platformWidth/densityFactor),
	"navGroup" : {},
	"theme" : {},
	"currLocation" : {
		"lat" : 0,
		"lon" : 0
	},
	"events" : {
		"CurrentLocation" : "APP::CurrentLocation"
	}
};