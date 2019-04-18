/*
*    Copyright 2018 Misty Robotics, Inc.
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

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
				if (data === null || data[0] === null || data.result.status === "Error") {
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
				if (data === null || data[0] === null || data.result.status === "Error") {
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
