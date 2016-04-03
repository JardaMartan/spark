/**
 * http://usejsdoc.org/
 */

// include spark-login.js
if ((roomId.length == 0) || (authToken.length == 0)) {
	console
			.log("Spark credentials are missing. Include \"spark-login.js\" in the HTML page.");
}

var maxMsg = 5;
var scrollSteps = new Array();
var scrollTimer = null;
var iteratedScrollTimer = null;

function scrollElement(element) {
	// elapsed
	var e;
	// duration in milli seconds
	var d = 1000;
	// b as in begin, where to start (you could get this dynamically)
	var b = 0;
	// start time, when the animation starts
	var s = (new Date()).getTime(); // start time
	// the magic
	var t = setInterval(function() {
		// calculate elapse time
		e = (new Date()).getTime() - s;
		// check if elapse time is less than duration
		if (e < d) {
			// animate using an easing equation
			var ypos = noease(e, b, element.offsetHeight, d);
			window.scrollBy(0, ypos);
		} else {
			// animation is complete, stop interval timer
			clearInterval(t);
			t = null;
		}
	}, 4);
}

function smoothScroll(yLength) {
	if (yLength == 0)
		return;
	if (scrollTimer != null) {
		clearInterval(scrollTimer);
		scrollTimer = null;
		console.log("Clearing dead timer");
	}
	// elapsed
	var position = 0;
	var e;
	// duration in milli seconds
	var d = 1000;
	var stepTime = 4;
	// b as in begin, where to start (you could get this dynamically)
	var b = 0;

	if ((d / stepTime) > Math.abs(yLength)) {
		stepTime = Math.round(d / yLength);
	}
	var stepHeight = Math.round(yLength / (d / stepTime));
	var duration = Math.round(yLength * stepTime / stepHeight);
	console.log("Scroll by: " + yLength + ", step height: " + stepHeight
			+ ", step time: " + stepTime + ", duration: " + duration);
	// the magic
	// start time, when the animation starts
	scrollTimer = setInterval(function() {
		// calculate elapse time
		// check if elapse time is less than duration
		if (Math.abs(yLength - position) > Math.abs(stepHeight)) {
			// animate using an easing equation
			window.scrollBy(0, stepHeight);
			position += stepHeight;
		} else {
			// animation is complete, stop interval timer
			clearInterval(scrollTimer);
			scrollTimer = null;
			window.scrollBy(0, yLength - position); // finalize
			console.log("Done. Y length: " + yLength + ", position: "
					+ position);
		}
	}, stepTime);
}

// Info about the letters (I think)
// t = elapse time
// b = where to begin
// c = change in comparison to begin
// d = duration of animation
function noease(t, b, c, d) {
	t /= d;
	return b + c * (t);
}

function ease(t, b, c, d) {
	var result = Math.round(-c * Math.cos(t / d * (Math.PI / 2)) + c + b);
	console.log("Ease: " + t + ", " + b + ", " + c + ", " + d + ", " + result);
	return result;
}

function updateScrollSteps() {
	var roomDiv = document.getElementById("room");
	var roomElements = roomDiv.getElementsByTagName("div");
	scrollSteps = new Array();
	for (var i = 0; i < roomElements.length; i++) {
		var elId = roomElements[i].id;
		console.log("Element "+i+" id: "+elId);
//		if (elId.match("item.div.content*")) {
		if (elId.match(/item.div.\d+/)) {
			console.log("Evaluating " + elId + ", offset: "
					+ roomElements[i].offsetHeight);
			if (roomElements[i].offsetHeight > 0) {
				scrollSteps.push(roomElements[i].offsetHeight);
				console.log("Adding main height: " + roomElements[i].offsetHeight);
			}
/*			if (roomElements[i].hasChildNodes()) {
				var elChildren = roomElements[i].children;
				for (var j = 0; j < elChildren.length; j++) {
					console.log("Looking at " + elChildren.item(j).id
							+ ", offset: " + elChildren.item(j).offsetHeight);
					if (elChildren.item(j).offsetHeight > 0) {
						scrollSteps.push(elChildren.item(j).offsetHeight);
						console.log("Adding sub height: " + elChildren.item(j).offsetHeight);
					}
				}
			} */
		}
	}
}

function iteratedScroll() {
	// elapsed
	var e;
	// duration in milli seconds
	var d = 20000;
	// b as in begin, where to start (you could get this dynamically)
	var b = 0;
	// start time, when the animation starts
	var s = (new Date()).getTime(); // start time
	// the magic
	var pos = 0;
	var estimatedPos = 0;
	if (iteratedScrollTimer != null) {
		clearInterval(iteratedScrollTimer);
		iteratedScrollTimer = null;
		console.log("Clearing old iterated scroll timer");
	}
	iteratedScrollTimer = setInterval(
			function() {
				var totalHeight = 0;
				for (var i = 0; i < scrollSteps.length; i++) {
					totalHeight += scrollSteps[i];
				}
				if ((pos >= scrollSteps.length)
						|| (((window.innerHeight + window.pageYOffset) >= totalHeight) && (pos >= (scrollSteps.length - 2)))) {
					pos = 0;
					estimatedPos = 0;
					console.log("Scrolled down, going to 0,0, total height: "
							+ totalHeight);
					smoothScroll(-(window.innerHeight + window.pageYOffset));
					// window.scrollTo(0, 0);
					// updateScrollSteps();
				} else {
					console.log("Scroll " + pos + " start, length: "
							+ scrollSteps[pos]);
					smoothScroll(scrollSteps[pos]);
					estimatedPos += scrollSteps[pos];
					console.log("Scroll " + pos + " done, Y offset "
							+ window.pageYOffset + ", should be: "
							+ estimatedPos);
					pos++;
				}
			}, 2000);
	/*
	 * var t = setInterval(function() { //calculate elapse time e = (new
	 * Date()).getTime() - s; //check if elapse time is less than duration if (e <
	 * d) { //animate using an easing equation } else { //animation is complete,
	 * stop interval timer /* clearInterval(t); t = null; b = 0; s = (new
	 * Date()).getTime(); } }, 1000);
	 */
}

function converterEngine(input) { // fn BLOB => Binary => Base64 ?
	var uInt8Array = new Uint8Array(input);
	var i = uInt8Array.length;
	console.log("Base64 length: " + uInt8Array.length);
	var biStr = []; // new Array(i);
	while (i--) {
		biStr[i] = String.fromCharCode(uInt8Array[i]);
	}
	var base64 = window.btoa(biStr.join(''));
	return base64;
};

function isImage(contentType) {
	return contentType.match('image.*');
}

function updateFileAtIndex(url, indexMain, indexLocal) {
	console.log("URL: " + url + ", iM: " + indexMain + ", iL: " + indexLocal);
	var imgHttp = new XMLHttpRequest();
	imgHttp.responseType = 'arraybuffer';
	imgHttp.onreadystatechange = function() {
		if (imgHttp.readyState == 4) { // If the request state = 4
			// (completed)...
			if (imgHttp.status == 200) { // And the status = 200 (OK),
				// then...
				var contentType = imgHttp.getResponseHeader("content-type");
				if (isImage(contentType)) {
					var arrayBufferView = new Uint8Array(imgHttp.response);
					var blob = new Blob([ arrayBufferView ], {
						type : contentType
					});
					var urlCreator = window.URL || window.webkitURL;
					var imageUrl = urlCreator.createObjectURL(blob);

					/*
					 * var img64 = converterEngine(imgHttp.response);
					 * document.getElementById("room.msg." + indexMain + "." +
					 * indexLocal).src = "data:" + contentType + ";base64," +
					 * img64;
					 */
					document.getElementById("item.div.content.img." + indexMain
							+ "." + indexLocal).src = imageUrl;
				} else { // not an image, hide the element
					document.getElementById("item.div.content.img." + indexMain
							+ "." + indexLocal).visibility = "hidden";
				}

				updateScrollSteps();
			} else {
				console.log('Error loading file, code: ' + imgHttp.status
						+ ", " + imgHttp.statusText);
			}
		}
	}
	imgHttp.open('GET', url, true);
	imgHttp.setRequestHeader('Authorization', authToken);
	imgHttp.send();
}

function updateAvatarAtIndex(personId, indexMain) {
	console.log("Person ID: " + personId + ", index: " + indexMain);
	var avatarHttp = new XMLHttpRequest(); // Create an AJAX HTTP request
	// object
	avatarHttp.onreadystatechange = function() { // Define a handler, which
		// fires when the request
		// completes
		if (avatarHttp.readyState == 4) { // If the request state = 4
			// (completed)...
			if (avatarHttp.status == 200) { // And the status = 200 (OK),
				// then...
				var avatarData = JSON.parse(avatarHttp.responseText); // Parse
				// the
				// JSON
				// response
				// into
				// an
				// object
				if ("avatar" in avatarData) {
					var avatarURL = avatarData['avatar'];
					console.log("Avatar URL: " + avatarURL);
					document.getElementById("item.div.avatar." + indexMain).innerHTML = "<img src=\""
							+ avatarURL + "\" /><br>\n";
				}
				var dispName = avatarData['displayName'].split(" ");
				document.getElementById("item.div.avatar." + indexMain).innerHTML += dispName[0];

				updateScrollSteps();
			} else
				alert('Error requesting person data: ' + avatarHttp.statusText)
		}
	}
	avatarHttp.open('GET', 'https://api.ciscospark.com/v1/people/' + personId,
			true); // Initialize the HTTP request object for GET the messages
	// Build the HTML form request body
	avatarHttp.setRequestHeader('Authorization', authToken); // Sending the
	// content as
	// URL-encoded
	// form data
	avatarHttp.send(); // Execute the AJAX HTTP request
}

function refreshSparkData() {
	var html = "";
	xhttp = new XMLHttpRequest(); // Create an AJAX HTTP request object
	xhttp.onreadystatechange = function() { // Define a handler, which fires
		// when the request completes
		if (xhttp.readyState == 4) { // If the request state = 4
			// (completed)...
			if (xhttp.status == 200) { // And the status = 200 (OK), then...
				var roomData = JSON.parse(xhttp.responseText); // Parse the
				// JSON response
				// into an
				// object
				var roomItems = roomData['items'];
				for (var i = 0; i < roomItems.length; i++) {
					var mod = "even";
					if ((i % 2) > 0) {
						mod = "odd";
					}
					html += "<div class=\"activity-item " + mod
							+ "\" id=\"item.div." + i + "\">\n";
					html += "<span class=\"avatar " + mod
							+ "\" id=\"item.div.avatar." + i + "\">\n";
					updateAvatarAtIndex(roomItems[i]['personId'], i);
					html += "</span>\n";
					html += "<span class=\"item-content " + mod
							+ "\" id=\"item.div.content." + i + "\">\n";
					if ("text" in roomItems[i]) {
						html += roomItems[i]['text'];
					}
					if ("files" in roomItems[i]) {
						var filesUrl = roomItems[i]['files'];
						for (var j = 0; j < filesUrl.length; j++) {
							html += "<img id=\"item.div.content.img." + i + "."
									+ j + "\" src=\"\" /><br>\n";
							updateFileAtIndex(filesUrl[j], i, j);
						}
					}
					html += "</span>\n";
					html += "</div>\n";
				}
				document.getElementById("room").innerHTML = html;

				updateScrollSteps();
				iteratedScroll();
				// scrollElement(document.getElementById('room'));
			} else
				alert('Error requesting room data: ' + xhttp.statusText)
		}
	}
	xhttp.open('GET', 'https://api.ciscospark.com/v1/messages?roomId=' + roomId
			+ "&max=" + maxMsg, true); // Initialize the HTTP request object
	// for GET the messages
	// Build the HTML form request body
	xhttp.setRequestHeader('Authorization', authToken); // Sending the content
	// as URL-encoded form
	// data
	xhttp.send(); // Execute the AJAX HTTP request
}
