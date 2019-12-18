# Time of Flight Sample

This is a sample of JavaScript code used to retrieve information from the time of flight sensors via WebSockets. There are four time of flight sensors on Misty I: left, center, right, and back. The left, center, and right sensors are all located in the front. This sample code subscribes to the center time of flight sensor only.

## Subscribing to a WebSocket Data Stream

To subscribe to a WebSocket data stream, you must first open the WebSocket. Then, send a message to specify the exact data you want to receive. For some WebSocket data, you must also send a REST command to the robot to enable the systems that start generating that data. For the time-of-flight sensor data that the [`tofApp.js` sample](https://github.com/MistyCommunity/SampleCode/tree/master/Time%20of%20Flight) uses, sending a REST command is not required, because Misty's time-of-flight sensors are always on.

The first thing the `tofApp.js` sample does is to construct the message that subscribes to the exact WebSocket data we want.

The `Type` property is the name of the desired event type (or data stream) to receive messages from. Misty's available event types are described in detail in the [Event Types](../../../misty-ii/reference/sensor-data) documentation. You can subscribe to each of these event types via a WebSocket connection.

The optional `DebounceMs` value specifies how frequently the data is sent. For time-of-flight data, if you don't specify a value, by default the data is sent every 250ms. In this case, we've set it to be sent every 100ms.

The `EventName` property is a name you specify for how your code will refer to this particular WebSocket instance. It can be any name you like.

`Message` and `ReturnProperty` are optional values.

For time-of-flight subscriptions, you must also include `EventConditions`. You can use event conditions to specify which sensor(s) to stream data from, in cases where the event type streams messages from multiple sensors. Specify the `sensorId` of the time-of-flight sensor to get messages from (`toffr`, `toffl`, `toffc`, `toffr`, or [another `sensorId`](https://docs.mistyrobotics.com/misty-ii/reference/sensor-data/#time-of-flight-sensor-details)). This sample code subscribes to the front center time-of-flight sensor -- `toffc` -- only.

That “subscribe” message is then packaged (line 17) as a JSON object, so that it is ready to send once the WebSocket is open.

The sample next attempts to open a WebSocket connection (line 22). Once the WebSocket is open, we send the JSON-formatted “subscribe” message (lines 24-27).

### Handling Received WebSocket Data

Having constucted the `subscribe` and `unsubscribe` messages, the `tofApp.js` sample next attempts to open a WebSocket connection. Once the WebSocket is open, it sends the JSON-formatted "subscribe" message.

Once you've successfully subscribed to a data stream, you can use the `socket.onmessage()` function to handle the data received back from the robot. In this example, we handle the received data by logging it to the console. For a real robot application, you could instead parse the event data and write a conditional function based on a particular property value. This is how you code Misty to react to event data in useful and interesting ways.

In the sample, after a specified number of messages are received, we unsubscribe to the data stream and close the WebSocket connection. Alternately, because a given WebSocket could be used for multiple data subscriptions, you could keep the WebSocket open after unsubscribing and only close it when you are done running the application.
