function LightSocket(ip) {

	var ipAddress = (ip === null ? "localhost" : ip);
	var eventListeners = new Map();

	this.Subscribe = function (eventName, msgType, debounceMs, property, inequality, value, returnProperty, eventCallback) {
		eventName = eventName ? eventName : msgType
		console.log("Subscribing to " + eventName);

		var msg = {
			"$id": "1",
			"Operation": "subscribe",
			"Type": msgType,
			"DebounceMs": debounceMs,
			"EventName": eventName,
			"Message": "",
			"ReturnProperty": returnProperty
		};

		if (property) {
			msg.EventConditions = [
				{
					"Property": property,
					"Inequality": inequality ? inequality : "exists",
					"Value": value ? value : "0"
				}
			];
		}
		var message = JSON.stringify(msg);
		websocket.send(message);
		eventListeners.set(eventName, eventCallback);
	}

	this.Unsubscribe = function (eventName) {
		var msg = {
			"$id": "1",
			"Operation": "unsubscribe",
			"EventName": eventName,
			"Message": ""
		};
		var message = JSON.stringify(msg);
		websocket.send(message);
		eventListeners.delete(eventName);
		console.log("Unsubscribing from " + eventName);
	}

	this.Disconnect = function () {
		websocket.close();
	}

	this.Connect = function () {
		var me = this;
		websocket = new WebSocket("ws://" + ipAddress + "/pubsub");

		websocket.onopen = function () {
			console.log("Opened socket");//TODO Callback on this
		};

		websocket.onmessage = function (event) {
			try {
				//Parse the Json if possible and call the callback, otherwise it is probably a status
				var theDataObject = JSON.parse(event.data);
				var messageId = theDataObject.eventName ? theDataObject.eventName : theDataObject.type;
				if (eventListeners.has(messageId)) {
					eventListeners.get(messageId)(theDataObject);
				}
			}
			catch (e) {
				//TODO this is not necessarily an error just because it is not valid json 
				console.log("Invalid Json or failure obtaining callback", event.data);
			}
		};

		websocket.onclose = function () {
			console.log("Closed socket");//TODO Callback on this
		};

		window.onbeforeunload = function (event) {
			websocket.close();
		};

		return websocket;
	}

	this.Disconnect = function () {
		console.log("Disconnected from socket");
		websocket.close();
	}
};