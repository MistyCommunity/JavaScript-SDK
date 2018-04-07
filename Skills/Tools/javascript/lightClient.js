// 		Copyright 2018 Misty Robotics, Inc.
// 		Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
// 		to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// 		and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 		The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// 		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// 		WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function LightClient(ip, ajaxTimeout) {

	var ipAddress = (ip === null ? "localhost" : ip);
	var timeout = (ajaxTimeout === null ? 30000 : ajaxTimeout);

	this.SetIp = function (ip) {
		ipAddress = ip;
	}
	this.SetTimeout = function (theTimeout) {
		timeout = theTimeout;
	}

	this.GetCommand = function (command, successCallback = null, version = null) {
		var newUri = "http://" + ipAddress + "/api/" + (version ? version + "/" : "") + command;
		$.ajax({
			type: "GET",
			url: newUri,
			dataType: "json",
			async: true,
			timeout: this._timeout
		})
			.done(function (data, status, xhr) {
				if (data === null || data[0] === null || data[0].status === "Error") {
					console.log("Get " + (version ? version : "") + "Response Error:", data[0].errorMessage);
				}
				else if (successCallback) {
					// no errors and there is a callback function.
					successCallback(data);
				}
			})
			.fail(function (request, status, err) {
				// There was an error with the call.  Display error messages.
				console.log("Get Http Error: ", request, status, err);
			});
	}

	this.PostCommand = function (command, theData = {}, successCallback = null, version = null) {
		var newUri = "http://" + ipAddress + "/api/" + (version ? version + "/" : "") + command;
		$.ajax({
			type: "POST",
			url: newUri,
			data: theData,
			dataType: "json",
			async: true,
			timeout: this._timeout
		})
			.done(function (data) {
				if (data === null || data[0] === null || data[0].status === "Error") {
					console.log("Post " + (version ? version : "") + "Response Error:", data[0].errorMessage);
				}
				else if (successCallback) {
					successCallback(data);
				}
			})
			.fail(function (request, status, err) {
				// There was an error with the call.  Display error messages.
				console.log("Post Http Error: ", request, status, err);
			});
	}
}
