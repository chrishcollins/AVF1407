 // Fetch data using HTTP Get
 
//{String} url: the url to fetch data from
//{Function} callback: the callback function used when data is returned

exports.fetch = function(url, callback, attempts, sendCount) {
	var httpc = Ti.Network.createHTTPClient(), sendCount = sendCount || 0, defaults = {
		timeout : 5000,
		type : "GET",
		attempts : attempts || 10
	};

	httpc.setTimeout(defaults.timeout);

	httpc.onerror = function(e) {
		if (sendCount >= defaults.attempts) {
			Ti.API.error("Util.fetch: Request Error (Attemts: " + sendCount + ")");
			callback(false);
		} else {
			exports.fetch(url, callback, defaults.attempts, ++sendCount);
		}
	};

	httpc.onload = function(evt) {
		var json;

		try {
			json = JSON.parse(httpc.responseText);
		} catch(e) {
			Ti.API.error("Util.fetch: Invalid JSON from server");
			if (sendCount >= defaults.attempts) {
				Ti.API.error("Util.fetch: JSON Parse Error (Attemts: " + sendCount + ")");
				callback(false);
			} else {
				exports.fetch(url, callback, defaults.attempts, ++sendCount);
			}
		}

		callback(json);
	};

	sendCount++;
	if (Ti.Network.getOnline()) {
		Ti.API.log("Util.fetch: Attempt #" + sendCount);
		httpc.open(defaults.type, url);
		httpc.send();
	} else {
		httpc.onerror();
	}
};

exports.createDropShadow = function(bgColor, bottom) {
	var shadow = Ti.UI.createView({
		height : 3,
		backgroundGradient : {
			type : "linear",
			startPoint : {
				x : "0%",
				y : (bottom) ? "100%" : "0%"
			},
			endPoint : {
				x : "0%",
				y : (bottom) ? "0%" : "100%"
			},
			colors : [{
				color : bgColor,
				offset : 0.0
			}, {
				color : "transparent",
				offset : 1.0
			}]
		},
		opacity : 0.4,
		width : Ti.UI.FILL
	});

	shadow[ bottom ? "bottom" : "top"] = 0;

	return shadow;
}; 