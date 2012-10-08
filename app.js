(function(window, document) {
	var _slice = Array.prototype.slice;
	var _concat = Array.prototype.concat;

	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	var $, $upload;

	function createUploadDialog() {
		return $("<form/>")
			.append("<label>File: <input type='file' /></label>")
			.append("<br/>")
			.append("<input type='submit' />")
			.submit(function() {
				var files = $("input:file", this)[0].files;

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

				$("input:submit").prop("disabled", true);
			})
			.dialog({
				modal: true,
				autoOpen: false,
				title: "Upload a picture",
				open: function() {
					$("input:file", this).replaceWith("<input type='file' />");
					$("input:submit", this).prop("disabled", false);
				}
			})
		;
	}

	function addUploadButtons(elems) {
		$(elems).find(".gy")
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
						.css({ position: "relative", "top": -2 })
					.end()
			)
		;
	}
	function attachNewChatObserver() {
		var $chatContainer = $(".dw .no:first-child");

		new MutationObserver(function(mutations) {
			var additions = mutations
				.filter(function(m) { return m.addedNodes.length > 0; })
				.map(function(m) { return _slice.call(m.addedNodes, 0); })
			;

			addUploadButtons(_concat.apply([], additions));
		}).observe($chatContainer[0], { childList: true });

		$chatContainer.delegate(".gtu-button-upload", "click", function(e) {
			e.preventDefault();

			var $msg = $(e.target).closest("table").find("textarea");
			$upload.data("message-box", $msg).dialog("open");
		}).each(function() { addUploadButtons(this); });

		console.log("Attached new chat detector");
	}

	document.getElementById("jqueryui-gtu").addEventListener("load", function() {
		if(!window.jQuery) { return; }

		$ = window.jQuery.noConflict(true);

		if($(".dw .no:first-child").length > 0) { attachNewChatObserver(); }
		else {
			new MutationObserver(function(mutations, obs) {
				if($(".dw .no:first-child").length <= 0) { return; }

				attachNewChatObserver();

				obs.disconnect();
			}).observe(document.body, { childList: true });
		}

		$upload = createUploadDialog();
	});
})(window, document);