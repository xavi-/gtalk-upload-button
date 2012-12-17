(function() {
	var jquerycss = document.createElement("link");
	jquerycss.rel = "stylesheet";
	jquerycss.type = "text/css";
	jquerycss.media = "screen";

	var jqueryui = document.createElement("script");
	jqueryui.id = "jqueryui-gtu";
	jqueryui.async = true;
	jqueryui.addEventListener("load", function() { jqueryui.parentNode.removeChild(jqueryui); });
	document.body.appendChild(jqueryui);

	var jquery = document.createElement("script");
	jquery.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.js";
	jquery.async = true;
	jquery.addEventListener("load", function() {
		jquery.parentNode.removeChild(jquery);
		jqueryui.src = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.js";
		jqueryui.addEventListener("load", function() {
			document.head.appendChild(jquerycss);
			jquerycss.href = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/themes/excite-bike/jquery-ui.css";
		});
	});
	document.body.appendChild(jquery);

	var app = document.createElement("script");
	app.src = chrome.extension.getURL("app.js");
	app.async = true;
	app.addEventListener("load", function() { app.parentNode.removeChild(app); });
	document.body.appendChild(app);
})();