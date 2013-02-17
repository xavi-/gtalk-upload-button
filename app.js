(function(window, document) {
	var _slice = Array.prototype.slice;
	var _concat = Array.prototype.concat;

	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	var isPopout = false;
	var $, $upload;

	function uploadFiles(files, callback) {
		if(files.length <= 0) { return callback({ error: "No files to upload." }); }

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
			success: function(data) { callback(null, data); },
			error: function(data, status, error) {
				callback({ data: data, status: status, error: error });
			}
		});
	}

	function showError(err) {
		console.error("Uplaod error -- statue: " + err.status + "; error: " + err.error, err.data);

		var response = (err.data ? JSON.parse(err.data.responseText) : "No Data");
		window.alert(
			"An error occurred.\n" +
			"Status: " + err.status + "; error: " + err.error + "\n\n" +
			"Response:\n" +
			JSON.stringify(response, null, "\t")
		);
	}

	function createUploadDialog() {
		return $("<form/>")
			.append("<label>File: <input type='file' /></label>")
			.append("<br/>")
			.append("<input type='submit' />")
			.submit(function(e) {
				e.preventDefault();

				var files = $("input:file", this)[0].files;

				if(files.length <= 0) { return window.alert("Please upload an image file."); }

				uploadFiles(files, function(err, data) {
					$upload.dialog("close");

					if(err) { return showError(err); }

					console.log("success: ", data);
					var $msg = $upload.data("message-box");
					$msg.val($msg.val() + data.upload.links.original).focus();
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

	function attachButtonDelegatesIfNecessary() {
		if(attachButtonDelegatesIfNecessary.isAttached) { return; }

		(isPopout ? $(document.body) : $(".dw .no:first-child"))
			.delegate(".gtu-button-upload", "click", function(e) {
				e.preventDefault();

				if(!$upload) { $upload = createUploadDialog();}

				var $msg = $(e.target).closest("table").find("textarea");
				$upload.data("message-box", $msg).dialog("open");
			})
		;

		attachButtonDelegatesIfNecessary.isAttached = true;
	}
	function createHint() {
		return $('<div class="gtu-hint">Drop file here</div>')
			.css({
				"position": "absolute",
				"background": "white",
				"border": "3px dashed #000",
				"border-radius": 5,
				"top": 4,
				"bottom": 3,
				"left": 3,
				"right": 3,
				"font-weight": "bold",
				"line-height": "175%"
			})
			.hide()
			.bind("dragover", function() { $(this).css({ "border-color": "#7EE" }); })
			.bind("dragleave", function() { $(this).css({ "border-color": "#000" }); })
		;
	}
	function addUploadButtons(elems) {
		$(elems)
			.find(".aep")
				.css("position", "relative")
				.append(createHint())
				.bind("drop", function(e) {
					e.preventDefault();

					var $table = $(this).closest("table");

					$(".gtu-hint", $table).addClass("gtu-uploading").show().text("Uploading...");
					uploadFiles(e.originalEvent.dataTransfer.files, function(err, data) {
						$(".gtu-uploading", $table).removeClass("gtu-uploading").hide().text("Drop file here");

						if(err) { return showError(err); }

						console.log("success: ", data);
						var $msg = $("textarea", $table);
						$msg.val($msg.val() + data.upload.links.original).focus();
					});
				})
			.end()
			.find(".gy")
				.css("position", "relative")
				.prepend(
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

		attachButtonDelegatesIfNecessary();
	}
	function attachNewChatObserver() {
		var chatContainer = $(".dw .no:first-child")[0];

		new MutationObserver(function(mutations) {
			var additions = mutations
				.filter(function(m) { return m.addedNodes.length > 0; })
				.map(function(m) { return _slice.call(m.addedNodes, 0); })
			;

			addUploadButtons(_concat.apply([], additions));
		}).observe(chatContainer, { childList: true });

		addUploadButtons(chatContainer);

		console.log("Attached new chat detector");
	}

	document.getElementById("jqueryui-gtu").addEventListener("load", function() {
		if(!window.jQuery) { return; }

		window.gtu = window.gtu || {};
		$ = window.gtu.$ = window.jQuery.noConflict(true);

		isPopout = $(document.body).hasClass("xE");
		if(isPopout) { addUploadButtons($(".gN")); }
		else if($(".dw .no:first-child").length > 0) { attachNewChatObserver(); }
		else { // Page not done loading
			new MutationObserver(function(mutations, obs) {
				if($(".dw .no:first-child").length <= 0) { return; }

				attachNewChatObserver();
				$("body")
					.bind("dragover dragleave", function(e){
						e.preventDefault();
						clearTimeout($(this).data("hide-timeout"));
					})
					.bind("dragover", function() { $(".gtu-hint").show(); })
					.bind("dragleave", function(e) {
						$(this).data(
							"hide-timeout",
							setTimeout(function() { $(".gtu-hint:not(.gtu-uploading)").fadeOut(100); }, 100)
						);
					})
				;

				obs.disconnect();
			}).observe(document.body, { childList: true });
		}
	});
})(window, document);