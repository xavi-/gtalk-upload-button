(function() {
	var jquerycss = document.createElement("link");
	jquerycss.rel = "stylesheet";
	jquerycss.type = "text/css";
	jquerycss.media = "screen";
	document.head.appendChild(jquerycss);

	var jqueryui = document.createElement("script");
	jqueryui.id = "jqueryui-gtu";
	document.body.appendChild(jqueryui);
	jqueryui.addEventListener("load", function() { jqueryui.parentNode.removeChild(jqueryui); });

	var jquery = document.createElement("script");
	jquery.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.js";
	document.body.appendChild(jquery);
	jquery.addEventListener("load", function() {
		jquery.parentNode.removeChild(jquery);
		jqueryui.src = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.js";
		jquerycss.href = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/themes/excite-bike/jquery-ui.css";
	});

	var app = document.createElement("script");
	app.src = chrome.extension.getURL("app.js");
	document.body.appendChild(app);
	app.addEventListener("load", function() { app.parentNode.removeChild(app); });
})();