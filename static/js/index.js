import CrossControl from "./ui/controls/cross-control.js";
import WavesControl from "./ui/controls/waves-control.js";

const BASE_URL = "/";

const controls = [
	{ control: CrossControl, function: sendValue, key: 'framesize' },
	{ control: WavesControl, function: sendAgitation, key: 'gain' },
	{ control: CrossControl, function: sendValue, key: 'fractal_h' },
	{ control: WavesControl, function: sendAgitation, key: 'margin' },
	{ control: CrossControl, function: sendValue, key: 'slide_down' },
	{ control: WavesControl, function: sendAgitation, key: 'slide_up' },
];

makeRequest("GET", "control", {}, (result) => {
	console.log(result);

	const controlSetup = controls[result.id];
	const control = controlSetup.control;
	const func = controlSetup.function;
	const key = controlSetup.key;

	control.init('cross-control-container', func, key);
});

function sendAgitation(key) {
	var url = '';

	makeRequest("POST", url, {key: key}, () => {});
}

function sendValue(msg) {
	var url = '';

	makeRequest("POST", url, msg, () => {});
}

function makeRequest(type, url, body, onSuccess) {
	url = BASE_URL + url;

	var xhr = new XMLHttpRequest();
	xhr.open(type, url);

	xhr.setRequestHeader("Content-type", "application/json");

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			// console.log(xhr.status);
			// console.log(xhr.responseText);

			onSuccess(JSON.parse(xhr.responseText));
		}
	};

	xhr.send(JSON.stringify(body));
}