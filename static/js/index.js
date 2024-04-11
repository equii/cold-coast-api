import CrossControl from "./ui/controls/cross-control.js";

CrossControl.init('cross-control-container', function() {
	var url = '/';

	var xhr = new XMLHttpRequest();
	xhr.open('POST', url);

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			console.log(xhr.status);
			console.log(xhr.responseText);
		}
	};

	xhr.send();
});