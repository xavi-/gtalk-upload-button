(function() {
	var jquerycss = document.createElement("link");
	jquerycss.href = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/themes/excite-bike/jquery-ui.css";
	jquerycss.rel = "stylesheet";
	jquerycss.type = "text/css";
	jquerycss.media = "screen";
	document.head.appendChild(jquerycss);

	var jqueryui = document.createElement("script");
	jqueryui.id = "jqueryui-gtu";
	document.head.appendChild(jqueryui);
	jqueryui.addEventListener("load", function() { jqueryui.parentNode.removeChild(jqueryui); });

	var jquery = document.createElement("script");
	jquery.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.js";
	document.head.appendChild(jquery);
	jquery.addEventListener("load", function() {
		jquery.parentNode.removeChild(jquery);
		jqueryui.src = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.js";
	});

	var app = document.createElement("script");
	app.src = chrome.extension.getURL("app.js");
	document.head.appendChild(app);
	app.addEventListener("load", function() { app.parentNode.removeChild(app); });
})();