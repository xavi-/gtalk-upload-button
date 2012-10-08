document.getElementById("jqueryui-gtu").addEventListener("load", function() {
	if(!window.jQuery) { return; }

	window.gtu = window.gtu || {};
	var $ = window.gtu.$ = window.jQuery.noConflict(true);

	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	new MutationObserver(function(mutations, obs) {
		if($(".dw .no").length <= 0) { return; }

		var newChatObs = new MutationObserver(function(mutations) {
			mutations
				.filter(function(m) { return m.addedNodes.length > 0; })
				.forEach(function(m) {
					$(m.addedNodes).find(".gy")
						.css("position", "relative")
						.append(
							$("<button><span>⇪</span></button>")
								.addClass("gtu-button-upload")
								.css({
									position: "absolute",
									top: 2,
									left: 0,
									width: 15,
									height: 18,
									background: "#0FF",
									padding: 0
								})
								.find("span")
									.css({position: "relative", "top": -2 })
								.end()
						)
					;
				})
			;
		});

		var $upload = $("<form/>")
			.append("<label>File: <input type='file' /></label>")
			.append("<br/>")
			.append("<input type='submit' />")
			.submit(function() {
				var files = $("label > input", this)[0].files;
				
				var data = new FormData();
				data.append("image", files[0]);
				data.append("key", "449e0ea885033eea12558ae9ea945b52");

				$.ajax({
					url: "https://api.imgur.com/2/upload.json",
					data: data,
					cache: false,
					contentType: false,
					processData: false,
					type: "POST",
					success: function(data) {
						console.log("success: ", data);
						var $msg = $upload.data("message-box");
						$msg.val($msg.val() + data.upload.links.original);

						$upload.dialog("close");
					},
					error: function() {
						console.log("error");
						window.alert("An error occurred.");

						$upload.dialog("close");
					}
				});
			})
			.dialog({
				modal: true,
				autoOpen: false,
				title: "Upload a picture",
				open: function() { $("label > input", this).replaceWith("<input type='file' />"); }
			})
		;

		var $chatContainer = $(".dw .no").delegate(".gtu-button-upload", "click", function(e) {
			e.preventDefault();

			var $msg = $(e.target).closest("table").find("textarea");
			$upload.data("message-box", $msg).dialog("open");
		});

		newChatObs.observe($chatContainer[0], { childList: true });

		console.log("Attached new chat detector");
		obs.disconnect();
	}).observe(document.body, { childList: true });
});