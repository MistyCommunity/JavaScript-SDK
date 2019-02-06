## Time of Flight Sample

This is a sample of JavaScript code used to retrieve information from the time of flight sensors via WebSockets. There are four time of flight sensors on Misty I: left, center, right, and back. The left, center, and right sensors are all located in the front. This sample code subscribes to the center time of flight sensor only.

### Subscribing to a WebSocket Data Stream

To subscribe to a WebSocket data stream, you must first open the WebSocket, then send a message to specify the exact data you want to receive. For some data, you must also send a REST command to the robot so it starts generating the data. For the time of flight sensor data that this sample uses, sending a REST command is not required, because the time of flight sensors on the robot are always on.
The first thing this sample does (lines 2-15) is to construct the “subscribe” message that specifies the exact data we want. The **Type** property is the name of the desired data stream (from the list of available streams). The **EventName** property is your name for how your code will refer to this particular WebSocket instance. For time of flight subscriptions, you must also include **EventConditions**. These specify the location of the time of flight sensor being accessed by changing the Value property value to "Right", "Center", "Left", or “Back”.
That “subscribe” message is then packaged (line 17) as a JSON object, so that it is ready to send once the WebSocket is open.

The sample next attempts to open a WebSocket connection (line 22). Once the WebSocket is open, we send the JSON-formatted “subscribe” message (lines 24-27).

### Handling Received WebSocket Data

To handle the data received once you have successfully subscribed to an event, use the socket.onmessage function (lines 29-36). This example simply logs the data to the console and closes the socket after a specified number of messages are received. You could also parse the event data and write a conditional function based on a particular property value to do something when a condition is met.
