## Tutorial 4: Introduction to Mapping

Read this tutorial in the documentation at [docs.mistyrobotics.com](https://docs.mistyrobotics.com/onboarding/creating-skills/writing-skill/#tutorial-4-introduction-to-mapping)

This tutorial describes how to use Misty’s simultaneous localization and mapping (SLAM) system to obtain data about your robot’s location and draw a map of her surroundings. When this skill runs, Misty enables the mapping capabilities of her Occipital Structure Core depth sensor and creates a map as you use the API Explorer to drive her around her environment. When she finishes driving, Misty draws a map of the location she explored. This tutorial teaches
* how to use mapping REST API commands
* how to subscribe to the data stream from the `SelfState` WebSocket connection
* how to transform raw map data into a graphical map of Misty’s environment

Note that many real-world applications of Misty’s mapping capabilities require her to create a map while independently exploring her environment. Programs like this can be very complex as they require mapping commands to run alongside code telling Misty where to drive and how to avoid obstacles. For simplicity, this project requires you to use the API Explorer to move Misty instead of programming an automated exploration process.

### Setting Up Your Project
This project uses the Axios library and the `lightSocket.js` helper tool to handle requests and simplify the process of subscribing to Misty’s WebSocket connections. You can download this tool from our [GitHub repository](https://github.com/MistyCommunity/MistyI/tree/master/Skills/Tools/javascript). Save the `lightSocket.js` file to a “tools” or “assets” folder in your project.

To set up your project, create a new HTML document. Give it a title, and include references to `lightSocket.js` and a CDN for the Axios library in the `<head>` section. We write the code for commanding Misty within `<script>` tags in the `<body>` section of this document.


```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Remote Command Tutorial 4</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Include references to a CDN for the Axios library and the local path where lightSocket.js is saved in the <head> of your document -->
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="<local-path-to-lightSocket.js>"></script>
</head>
<body>
    <script>
    // The code for commanding Misty goes here!
    </script>
</body>
```

### Writing the Code
Within `<script>` tags in the `<body>` of your document, declare a constant global variable `ip` and set its value to a string with your robot’s IP address. We use this variable to send commands to Misty. Other global variables are declared later in the project.

```js
// Declare a global variable ip and set its value to a string with your robot's IP address.
const ip = "<robotipaddress>";
```

Create a new instance of `LightSocket`  called `socket`. This instance of `LightSocket` takes as parameters the IP address of your robot and two optional callback functions (the first triggers when a connection is opened, and the second triggers when it’s closed). Pass the `ip` variable and a function called `openCallback()` to `socket` as the first and second parameters. Below these declarations, declare the `openCallback()` function.

```js
// Create a new instance of LightSocket called socket. Pass as arguments the ip variable and a function named openCallback.
let socket = new LightSocket(ip, openCallback);

/* CALLBACKS */

// Define the function passed as the callback to the new instance of LightSocket. This is the code that executes when socket opens a connection to your robot.
function openCallback() {

}
```

Next, subscribe to the `SelfState` WebSocket data stream. `SelfState` provides data about Misty’s current internal state at regular intervals. This tutorial uses data related to the `"slamStatus"` property, which indicates the status of Misty’s SLAM sensor. Mapping commands only work if Misty’s SLAM system is ready to receive them, and we use the value of `"slamStatus"` to send Misty the right commands at the right times.

Create a function called `subscribeSelfState()`, and within that function call `socket.Subscribe()`. The `socket.Subscribe()` method takes eight arguments. For more information about what each of these arguments does, see the documentation on using the `lightSocket.js` tool [here](https://docs.mistyrobotics.com/onboarding/creating-skills/writing-skill/#using-the-lightsocket-js-helper).

```js
socket.Subscribe(eventName, msgType, debounceMs, property, inequality, value, [returnProperty], [eventCallback])
```

Pass `"SlamStatus"` for the `eventName` argument and `"SelfState"` for `msgType`. Pass `5000` for `debounceMS` to tell Misty to send a `SelfState` message every 5 seconds. Pass `null` for the `property`, `inequality`, and `value` arguments. For the `returnProperty` argument, enter the string `"slamStatus"` to trim the message to include only the desired SLAM status data. For `eventCallback`, pass `_SelfState` as the name of the callback function to run when you receive data from this subscription. 


```js
/* WEBSOCKET SUBSCRIPTION FUNCTIONS */

// Create a function called subscribeSelfState() to subscribe to SelfState events.
function subscribeSelfState() {
    // Call socket.Subscribe(). Pass "SlamStatus" for the eventName argument and "SelfState" for msgType. Pass 5000 for debounceMS to tell Misty to send a SelfState message every 5 seconds. Pass null for the property, inequality, and value arguments. For the returnProperty argument, enter the string "slamStatus" to trim the message to include only the desired SLAM status data. For eventCallback, pass _SelfState as the name of the callback function to run when you receive data from this subscription.
    socket.Subscribe("SlamStatus", "SelfState", 5000, null, null, null, "slamStatus", _SelfState);
}
```

Call this `subscribeSelfState()` function inside `openCallback()` to subscribe to this event only after you establish a connection to Misty.

```js
/* CALLBACKS */

function openCallback() {
    // Call subscribeSelfState() to subscribe to SelfState events only after you establish a connection to Misty.
    subscribeSelfState();
}
```

Define another global variable to keep track of whether we are subscribed to the event. Call it `subscribed` and initialize it as `false`.

```js
/* GLOBALS */

const ip = "<robotipaddress>";
// Define a global variable to keep track of whether we are subscribed to the event.
let subscribed = false;
let socket = new LightSocket(ip, openCallback);
```

Now we can write the code to start mapping. Define an asynchronous function called `startMapping()` and call this function after `subscribeSelfState()` in `openCallback()`. 

```js
function openCallback() {
   subscribeSelfState();
   // Call the startMapping() function to start mapping after the event subscription is established.
   startMapping();
}

/* COMMANDS */

// Declare a function that sends the command to start mapping.
function startMapping() {
}
```

The `startMapping()` function sends a request to the REST endpoint for the command to start mapping. However, this request should not be sent until after we have subscribed to the `SelfState` event. We want our program to pause so the event subscription has time to become established. To accomplish this, create a helper function called `sleep()`. The `sleep()` function creates and returns a promise that resolves when `setTimeout()` expires after a designated number of milliseconds. Define `sleep()` at the top of the script so it can be referenced throughout the program.

```js
/*TIMEOUT */

// Define a helper function called sleep that can pause code execution for a set period of time.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

Within `startMapping()`, use a `while` loop to run `sleep()` (for 500 milliseconds) repeatedly for as long as `subscribed` is set to `false`. 

```js
async function startMapping() {
    // Use a while loop to run sleep() (for 500 milliseconds) repeatedly for as long as subscribed is set to false.
    while (!subscribed) {
        await sleep(500);
   }
}
```

The callback for our `SelfState` event sends an initial registration message once the event is subscribed to. When this happens, we want to update `subscribed` to `true` to break the  `while` loop in `startMapping()` and continue execution. Define the `_SelfState()` callback function beneath `openCallback()` and use an `if` statement to check if `subscribed` is `false`. If it is, set it to `true`.  

```js
/* CALLBACKS */

function openCallback() {
    subscribeSelfState();
    startMapping();
}

// Define the callback function that handles data sent through the event subscription. 
function _SelfState(data) {
    // Update subscribed to true.   
    if (!subscribed) {
	    subscribed = true;
   }
}
```

The code within `startMapping()` continues to execute once the first message is received, `_SelfState()` is triggered, `subscribed` is updated to `true`, and our event is registered. After the `while` loop in `startMapping()`, use `axios.post()` to send a POST request to the endpoint for the [`SlamStartMapping`](https://docs.mistyrobotics.com/apis/api-reference/rest/#slamstartmapping-alpha) command. `SlamStartMapping` tells Misty to establish her current orientation and position and engages her depth sensor to obtain map data. We refer to Misty’s orientation and position on a map as pose. 

```js
async function startMapping() {
    while (!subscribed) {
        await sleep(500);
    }
    // Use `axios.post()` to send a POST request to the endpoint for the `SlamStartMapping` command.
    axios.post("http://" + ip + "/api/alpha/slam/map/start");
}
```

Mapping requires commands to be issued at the right time and in the right order. As we control the flow of our program, it’s a good idea to include a series of sequential numerical logs to indicate that everything is happening in the right sequence. Within `_SelfState()`, print a message to the console to indicate that a subscription is established and that Misty is obtaining pose. 

```js
function _SelfState(data) {
    if (!subscribed) {
	    subscribed = true;
    }
    // Print a message to the console to indicate that a subscription is established and that Misty is obtaining pose
    console.log("1 - Subscribed to SelfState, getting pose");
}
```

The `"runMode"` property within `"slamStatus"` holds a string value that provides the current status of Misty’s SLAM system. This status indicates when Misty is ready to start collecting data. Use the `sleep()` function and a global variable to keep track of whether Misty is ready to start mapping. Define the global variable `ready` near the top of the program and initialize it as `false`. We also want to track when Misty is in the process of mapping. Declare a variable `mapping` and set it to `false` as well.

```js
/* GLOBALS */

const ip = "<robotipaddress>";
let subscribed = false;

// Use global variables to keep track of whether Misty is ready to start mapping. Define the global variable ready near the top of the program and initialize it as false.
let ready = false;
//  We also want to track when Misty is in the process of mapping. Declare a variable mapping and set it to false as well.
let mapping = false;

let socket = new LightSocket(ip, openCallback);
```

Back in `startMapping()`, set `mapping` to `true` just before making the POST request. After the request, call the next function in the process, `getMap()`, and define this function below `startMapping()`. The entire `startMapping()` function is shown here for reference.

```js
async function startMapping() {
   while (!subscribed) {
	await sleep(500);
   }
   //Set mapping to true.
   mapping = true;
   axios.post("http://" + ip + "/api/alpha/slam/map/start");
   // Call getMap() to gather and return mapping data. 
   getMap();
}

// Define getMap() as an asynchronous function. getMap() will gather map data as Misty drives around her enviornment and return it to your program when she is done mapping.
async function getMap() {
}
```

Within `getMap()`, start by creating another `while` loop that runs `sleep()` repeatedly for as long as `ready` is set to `false`. It takes a few seconds for Misty to obtain pose, and we want execution to pause until this process is complete.

```js
async function getMap() {

    // Create a while loop that runs sleep() repeatedly for as long as ready is set to false. This pauses execution until Misty has obtained pose.
    while (!ready) {
        await sleep(500);
   }
}
```

The messages coming in from our `SelfState` event contain a status message indicating whether the sensor is ready to collect data. The callback `_SelfState()` triggers every 5 seconds with new information from this event.

Information received through a WebSocket connection can include registration messages that we need to filter out when evaluating the data. Below the `if` statement in `_SelfState()`, write another `if` statement to check that a received message is indeed the requested property data. The value of `data.message` is an object (not a string) when we are receiving data. Ensure a message is relevant data by executing the code in the `if` statement on the condition that the value of `data.message` is not a string.

```js
function _SelfState(data) {
    if (!subscribed) {
	    subscribed = true;
    }
    console.log("1 - Subscribed to SelfState, getting pose");
    // The value of data.message will be an object if is relevant to our slamStatus event. Ensure a message is relevant data by executing the code in this if statment only under the condition that the value of data.message is not a string
    if (typeof data.message != "string") {

    }
}
```

The status of the SLAM system is contained within `data.message`. Declare a variable `runMode` to hold the current status of the SLAM system. Print a message to the console with the value of this variable to see the current status of the SLAM system as the program runs.

```js
function _SelfState(data) {
    if (!subscribed) {
	    subscribed = true;
    }
    console.log("1 - Subscribed to SelfState, getting pose");
    if (typeof data.message != "string") {

        // The status of the SLAM system is contained within data.message. Declare a variable runMode to hold the current status of the SLAM system.
        let runMode = data.message.runMode;
        // Print a message to the console with the value of this variable to see the current status of the SLAM system as the program runs.
        console.log("runMode: " + runMode);
    }
}
```


We want to update certain variables we defined earlier depending on the status of the SLAM sensor. Write a `switch` statement that checks the value of `runMode`. If it is equal to the string `"Ready"`, break from the statement and do nothing (`"Ready"` is the initial state of the sensor). If it is equal to `"Exploring"`, pose is obtained and Misty is ready to start driving around to collect map data. In this case we want to update `ready` to `true` to break the `while` loop within  `getMap()` and continue execution in that function. The full `switch` statement includes more code, but you can see its current state here:

```js
function _SelfState(data) {
    if (!subscribed) {
	    subscribed = true;
    }
    console.log("1 - Subscribed to SelfState, getting pose");
    if (typeof data.message != "string") {

        let runMode = data.message.runMode;
        console.log("runMode: " + runMode);
        // Write a switch statement that checks the value of runMode. If it is equal to the string "Ready", break from the statement and do nothing ("Ready" is the initial state of the sensor). If it is equal to "Exploring", pose is obtained and Misty is ready to start driving around to collect map data. In this case we want to update ready to true to break the while loop within getMap() and continue execution in that function. 
        switch (runMode) {
            case "Ready":
                break
            case "Exploring":
                ready = true;
                break
        }
    }
}
```

After the `while` loop within `getMap()`, log a second message to the console to indicate that pose is obtained and Misty is ready to start collecting map data. 

```js
async function getMap() {
    while (!ready) {
        await sleep(500);
    }
    // Log a message to the console to indicate that pose is obtained and Misty is ready to start collecting map data.
    console.log("2 - Pose obtained, starting mapping");
}
```

The next step is to use an `alert` to pause execution of the program and give Misty time to drive around collecting data. Execution of the program only continues once the user clicks **OK**. You can use the API Explorer or the Misty Companion App to drive Misty around. Be sure to drive slowly and thoroughly cover the room Misty is mapping. As Misty drives, the Occipital Structure Core depth sensor measures her distance from the objects she detects and localizes them relative to her current orientation and location.

```js
async function getMap() {
    while (!ready) {
        await sleep(500);
    }
    console.log("2 - Pose obtained, starting mapping");
    // Use an alert to pause execution of the program and give Misty time to drive around collecting data. Execution of the program only continues once the user clicks OK.
    alert("Head over to the API explorer and drive Misty around the room to gather map data. Once finished, hit ok to proceed.");
}
```

Click **OK** after driving Misty around. At this point, Misty should have enough data to draw a map of her surroundings. Below the `alert` in `getMap()`, use `axios.post()` to send a POST request to the endpoint for the [`SlamStopMapping`](https://docs.mistyrobotics.com/apis/api-reference/rest/#slamstopmapping-alpha) command.

```js
async function getMap() {
    while (!ready) {
        await sleep(500);
    }
    console.log("2 - Pose obtained, starting mapping");
    alert("Head over to the API explorer and drive Misty around the room to gather map data. Once finished, hit ok to proceed.");
    // Use axios.post() to send a POST request to the endpoint for the SlamStopMapping command.
    axios.post("http://" + ip + "/api/alpha/slam/map/stop");
}
```

Once again, we need to pause execution while Misty stops mapping. When the process is complete, we can obtain the map data. Below the POST request, write another `while` loop  to pause execution while `mapping` is `true`.

```js
async function getMap() {
    while (!ready) {
        await sleep(500);
    }
    console.log("2 - Pose obtained, starting mapping");
    alert("Head over to the API explorer and drive Misty around the room to gather map data. Once finished, hit ok to proceed.");
    axios.post("http://" + ip + "/api/alpha/slam/map/stop");
    // Write another while loop to pause execution while mapping is true.
    while (mapping) {
        await sleep(500); 
    }
}
```

In the `switch` statement of the `_SelfState()` callback function, add one more case. If `runMode` is equal to the string `"Paused"`, update `mapping` to `false`. This will occur a few seconds after we issue the `SlamStopMapping` command.

```js
function _SelfState(data) {
    if (!subscribed) {
	    subscribed = true;
    }
    console.log("1 - Subscribed to SelfState, getting pose");
    if (typeof data.message != "string") {

        let runMode = data.message.runMode;
        console.log("runMode: " + runMode);

        switch (runMode) {
            case "Ready":
                break
            case "Exploring":
                ready = true;
                break
            // If runMode is equal to the string "Paused", update mapping to false. This will occur a few seconds after we issue the SlamStopMapping command.
            case "Paused":
                mapping = false;
                break
        }
    }
}
```

Wrap the second `if` statement of `_SelfState()` inside a `try, catch` statement to handle any unforeseen exceptions. 

```js
function _SelfState(data) {
    if (!subscribed) {
	    subscribed = true;
    }
    console.log("1 - Subscribed to SelfState, getting pose");
    // Wrap the second if statement of _SelfState() inside a try, catch statement to handle any unforeseen exceptions.
    try {
        if (typeof data.message != "string") {
    
            let runMode = data.message.runMode;
            console.log("runMode: " + runMode);
    
            switch (runMode) {
                case "Ready":
                    break
                case "Exploring":
                    ready = true;
                    break
                case "Paused":
                    mapping = false;
                    break
            }
        }
    }
     catch (e) {
    }
}
```

To review: within `getMap()`, after Misty gathers map data and sends the command to stop mapping, we use a `while` loop to pause execution until Misty’s SLAM sensor status is `"Paused"` (indicating mapping has stopped). This status is tracked by the value of `mapping` and updated within the `_SelfState()` function. When mapping has stopped, the execution of `getMap()` continues. 

At this point, print another message to the console indicating the mapping process has stopped and the map is being obtained.

```js
async function getMap() {
    while (!ready) {
        await sleep(500);
    }
    console.log("2 - Pose obtained, starting mapping");
    alert("Head over to the API explorer and drive Misty around the room to gather map data. Once finished, hit ok to proceed.");
    axios.post("http://" + ip + "/api/alpha/slam/map/stop");
    while (mapping) {
        await sleep(500); 
    }
    // Print a message to the console indicating the mapping process has stopped and the map is being obtained.
    console.log("3 - Mapping has stopped, obtaining map");
}
```

**Note:** If the program is running properly, these log messages should appear in order. If they don’t (if you see message 3 before message 2), then something isn’t right and you need to attempt to debug the issue.

In order to get the raw map data Misty just collected, use `axios.get()` to send a GET request to the endpoint for the `SlamGetRawMap` command. Use `then()` to call two new functions, `unsubscribeSelfState()` and `processMap()`. We use these commands to respectively unsubscribe from the event and generate a graphical map from the map data. Log any errors to the console within a `catch()` statement. 

```js
async function getMap() {
    while (!ready) {
        await sleep(500);
    }
    console.log("2 - Pose obtained, starting mapping");
    alert("Head over to the API explorer and drive Misty around the room to gather map data. Once finished, hit ok to proceed.");
    axios.post("http://" + ip + "/api/alpha/slam/map/stop");
    
    while (mapping) {
        await sleep(500); 
    }
    console.log("3 - Mapping has stopped, obtaining map");

    // Use axios.get() to send a GET request to the endpoint for the SlamGetRawMap command. Use then() to call two new functions, unsubscribeSelfState() and processMap(). We use these commands to respectively unsubscribe from the event and generate a graphical map from the map data. Log any errors to the console within a catch() statement.
    axios.get("http://" + ip + "/api/alpha/slam/map/raw")
        .then((data) => {
		    unsubscribeSelfState();
			processMap(data);
        })
		.catch((err) => {
            console.log(err);
        })
}
```

Define `unsubscribeSelfState()` near `subscribeSelfState` toward the top of your program. Call `socket.Unsubscribe()` within the function, passing the string `"SlamStatus"` (the name given the `SelfState` event).

```js
/* WEBSOCKET SUBSCRIPTION FUNCTIONS */

function subscribeSelfState() {
    socket.Subscribe("SlamStatus", "SelfState", 5000, null, null, null, "slamStatus", _SelfState);
}

// Define unsubscribeSelfState() to unsubscribe from the SelfState event. Call socket.Unsubscribe() within the function, passing the string "SlamStatus" (the name given the SelfState event).
function unsubscribeSelfState() {
    socket.Unsubscribe("SlamStatus");
}
```

The `processMap()` function is called to isolate the map data after we receive a response from the `SlamGetRawMap` command.  Declare a function `processMap()`. This function starts by printing another log message indicating we have received the map data. Define a variable, `data` to store the map data within the response. 

```js
// Define the processMap() function to isolate the map data.
function processMap(res) {
    // Print a log message indicating we have recieved the map data.
    console.log("4 - Recieved map, processing map data");
    // Define a variable to store the map data sent with the response.
    let data = res.data;
}
```

The API Explorer uses a function called `drawMap()` to generate a graphical map from raw map data. This tutorial borrows the `drawMap()` function from the API Explorer code. Pass `data` into `drawMap()` to draw the map in the browser. 

```js
function processMap(res) {
    console.log("4 - Recieved map, processing map data");
    let data = res.data;
    // Pass data into drawMap() to draw the map in the browser.
    drawMap(data)
}
```

The data returned by `SlamGetRawMap` includes a two-dimensional matrix with values representing individual cells of space on the map. Each cell in the matrix has a value of 0, 1, 2, or 3 -- 0 indicates "unknown" space, 1 indicates "open" space, 2 indicates "occupied" space, and 3 indicates "covered" space. The `drawMap()` function iterates over each value in the matrix to generate a two-dimensional graphical representation of the map.

Insert the helper function `drawMap()` at the end of the program.

```js
// Use this function from the API Explorer source code to create a graphic image of the map Misty generates.
function drawMap(data) {
    var canvas = document.getElementById("mapCanvas");
    var context = canvas.getContext("2d");
    canvas.width = (data[0].result.width - 1) * pixelsPerGrid;
    canvas.height = (data[0].result.height - 1) * pixelsPerGrid;
    context.scale(pixelsPerGrid, pixelsPerGrid);
    data[0].result.grid.reverse().forEach(function (item) { item.reverse(); });
    for (var currentX = data[0].result.height - 1; currentX >= 0; currentX--) {
        for (var currentY = data[0].result.width - 1; currentY >= 0; currentY--) {
            context.beginPath();
            context.lineWidth = 1;
            switch (data[0].result.grid[currentX][currentY]) {
                case 0:
                    // "Unknown"
                    context.fillStyle = 'rgba(133, 133, 133, 1.0)'; // '#858585';
                    break;
                case 1:
                    // "Open"
                    context.fillStyle = 'rgba(255, 255, 255, 1.0)'; // '#FFFFFF';
                    break;
                case 2:
                    // "Occupied"
                    context.fillStyle = 'rgba(42, 42, 42, 1.0)'; // '#2A2A2A';
                    break;
                case 3:
                    // "Covered"
                    context.fillStyle = 'rgba(102, 0, 237, 1.0)'; // 'rgba(33, 27, 45, 0.5)'; // '#6600ED';
                    break;
                default:
                    context.fillStyle = '#ff9b9b';
                    break;
            }
            context.rect(currentY - 1 * pixelsPerGrid, currentX - 1 * pixelsPerGrid, pixelsPerGrid, pixelsPerGrid);
            context.fill();
        }
    }
    alert("Skill finished! Successfully obtained and drew a map!");
}
```

Declare a global variable `pixelsPerGrid` and set its value to `10`. This variable is used in the `drawMap()` function to determine the size (in pixels) of each cell on the map. Adjust this value to change the size of the map.

```js
/* GLOBALS */

const ip = "<robotipaddress>";

// Declare a global variable pixelsPerGrid and set its value to 10. This variable is used in the drawMap() function to determine the size (in pixels) of the map. Adjust this value to change the size of the map.
const pixelsPerGrid = 10;
let subscribed = false;
let ready = false;
let mapping = false;
let socket = new LightSocket(ip, openCallback);
```

In the `<body>` of your project, create an HTML `<canvas>` element to hold the map. Set the `id` attribute of this element to the string `"mapCanvas"`. The the `drawMap()` function references this `id` to create the map in this element.

```html
<body>
    <!-- Create a canvas element to hold the graphic map -->
    <canvas id="mapCanvas" class="col-md-9 col-sm-12 mr-2"></canvas>
    <script>
        // Code to command Misty
    </script>
</body>
```

At the bottom of the script, call `socket.Connect()`.When the connection is established, the `OpenCallback()` function executes and the process begins.

```js
// Open the connection to your robot.
socket.connect()
```

**Congratulations!** You’ve written a mapping program for Misty. When the document loads, the program:
* establishes a connection to your robot
* subscribes to the data stream from the `SelfState` WebSocket connection
* initiates the SLAM system to enable mapping
* prompts the user to use the API Explorer to explore an area
* generates a graphical representation of the map Misty generates

### Full Sample

See the full .html document for reference.

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>Remote Command Tutorial 4</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- Include references to a CDN for the Axios library and the local path where lightSocket.js is saved in the <head> of your document -->
	<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
	<script src="<local-path-to-lightSocket.js>"></script>
</head>
<body>
	<!--Create a canvas element to hold the graphic map-->
	<canvas id="mapCanvas" class="col-md-9 col-sm-12 mr-2"></canvas>
	<script>
		/* GLOBALS */

		// Declare a global variable ip and set its value to a string with your robot's IP address.
		const ip = "<robotipaddress>";
		// Declare a global variable pixelsPerGrid and set its value to 10. This variable is used in the drawMap() function to determine the size (in pixels) of the map. Adjust this value to change the size of the map.
		const pixelsPerGrid = 10;
		// Define a global variable to keep track of whether we are subscribed to the event.
		let subscribed = false;
		// Use global variables to keep track of whether Misty is ready to start mapping. Define the global variable ready near the top of the program and initialize it as false.
		let ready = false;
		//  We also want to track when Misty is in the process of mapping. Declare a variable mapping and set it to false as well.
		let mapping = false;
		// Create a new instance of LightSocket called socket. Pass as arguments the ip variable and a function named openCallback.
		let socket = new LightSocket(ip, openCallback);

		/*TIMEOUT */

        // Define a helper function called sleep that can pause code execution for a set period of time.
		function sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		/* CALLBACKS */

		// Define the function passed as the callback to the new instance of LightSocket. This is the code that executes when socket opens a connection to your robot.
		function openCallback() {
			// Call subscribeSelfState() to subscribe to SelfState events only after you establish a connection to Misty.
			subscribeSelfState();
			// Call the startMapping() function to start mapping after the event subscription is established.
			startMapping();
		}
		// Define the callback function that handles data sent through the event subscription. 
		function _SelfState(data) {
			// Update subscribed to true.   
			if (!subscribed) {
				subscribed = true;
				// Print a message to the console to indicate that a subscription is established and that Misty is obtaining pose
				console.log("1 - Subscribed to SelfState, getting pose");
			}
			// Update global variables depending on the SLAM sensor's status. Wrap this next block inside a try, catch statement to handle any unforeseen exceptions.
			try {
				// The value of data.message will be an object if is relevant to our slamStatus event. Ensure a message is relevant data by executing the code in this if statment only under the condition that the value of data.message is not a string
				if (typeof data.message != "string") {

					// The status of the SLAM system is contained within data.message. Declare a variable runMode to hold the current status of the SLAM system.
					let runMode = data.message.runMode;
					// Print a message to the console with the value of this variable to see the current status of the SLAM system as the program runs.
					console.log("runMode: " + runMode);
					// Write a switch statement that checks the value of runMode. If it is equal to the string "Ready", break from the statement and do nothing ("Ready" is the initial state of the sensor). If it is equal to "Exploring", pose is obtained and Misty is ready to start driving around to collect map data. In this case we want to update ready to true to break the while loop within getMap() and continue execution in that function. 
					switch (runMode) {
						case "Ready":
							break
						case "Exploring":
							ready = true;
							break
						// If runMode is equal to the string "Paused", update mapping to false. This will occur a few seconds after we issue the SlamStopMapping command.
						case "Paused":
							mapping = false;
							break
					}
				}
			}
			catch (e) {
			}
		}

		/* WEBSOCKET SUBSCRIPTION FUNCTIONS */
		// Create a function called subscribeSelfState() to subscribe to SelfState events.
		function subscribeSelfState() {
			// Call socket.Subscribe(). Pass `"SlamStatus"` for the `eventName` argument and "SelfState" for `msgType`. Pass `5000` for `debounceMS` to tell Misty to send a `SelfState` message every 5 seconds. Pass `null` for the `property`,`inequality`, and `value` arguments. For the `returnProperty` argument, enter the string "slamStatus" to trim the message to include only the desired SLAM status data. For `eventCallback`, pass `_SelfState` as the name of the callback function to run when you receive data from this subscription. 
			socket.Subscribe("SlamStatus", "SelfState", 5000, null, null, null, "slamStatus", _SelfState);
		}
		// Define unsubscribeSelfState() to unsubscribe from the SelfState event. Call socket.Unsubscribe() within the function, passing the string "SlamStatus" (the name given the SelfState event).
		function unsubscribeSelfState() {
			socket.Unsubscribe("SlamStatus");
		}


		/* COMMANDS */

		// Declare a function that sends the command to start mapping.
		async function startMapping() {
			// Use a while loop to run sleep() (for 500 milliseconds) repeatedly for as long as subscribed is set to false.
			while (!subscribed) {
				await sleep(500);
			}
			// update state
			mapping = true;
			// Use `axios.post()` to send a POST request to the endpoint for the `SlamStartMapping` command.
			axios.post("http://" + ip + "/api/alpha/slam/map/start");
			getMap();
		}

		// Define getMap() as an asynchronous function. getMap() will gather map data as Misty drives around her enviornment and return it to your program when she is done mapping.
		async function getMap() {
			// Create a while loop that runs sleep() repeatedly for as long as ready is set to false. This pauses execution until Misty has obtained pose.
			while (!ready) {
				await sleep(500);
			}
			// Log a message to the console to indicate that pose is obtained and Misty is ready to start collecting map data.
			console.log("2 - Pose obtained, starting mapping");
			// Use an alert to pause execution of the program and give Misty time to drive around collecting data. Execution of the program only continues once the user clicks OK.
			alert("Head over to the API explorer and drive Misty around the room to gather map data. Once finished, hit ok to proceed.");
			// Use axios.post() to send a POST request to the endpoint for the SlamStopMapping command.
			axios.post("http://" + ip + "/api/alpha/slam/map/stop");
			// Write another while loop to pause execution while mapping is true.
			while (mapping) {
				await sleep(500);
			}

			// Print a message to the console indicating the mapping process has stopped and the map is being obtained.
			console.log("3 - Mapping has stopped, obtaining map");

			// Use axios.get() to send a GET request to the endpoint for the SlamGetRawMap command. Use then() to call two new functions, unsubscribeSelfState() and processMap(). We use these commands to respectively unsubscribe from the event and generate a graphical map from the map data. Log any errors to the console within a catch() statement.
			axios.get("http://" + ip + "/api/alpha/slam/map/raw")
				.then((data) => {
					unsubscribeSelfState();
					processMap(data);
				})
				.catch((err) => {
					console.log(err);
				})
		}
		// Define the processMap() function to isolate the map data.
		function processMap(res) {
			// Print a log message indicating we have recieved the map data.
			console.log("4 - Recieved map, processing map data");
			// Define a variable to store the map data sent with the response.
			let data = res.data;
			// Pass data into drawMap() to draw the map in the browser.
			drawMap(data)
		}

		/*** Map-drawing Code from API explorer ***/
		// Use this function from the API Explorer source code to create a graphic image of the map Misty generates.
		function drawMap(data) {
			var canvas = document.getElementById("mapCanvas");
			var context = canvas.getContext("2d");
			canvas.width = (data[0].result.width - 1) * pixelsPerGrid;
			canvas.height = (data[0].result.height - 1) * pixelsPerGrid;
			context.scale(pixelsPerGrid, pixelsPerGrid);
			data[0].result.grid.reverse().forEach(function (item) { item.reverse(); });
			for (var currentX = data[0].result.height - 1; currentX >= 0; currentX--) {
				for (var currentY = data[0].result.width - 1; currentY >= 0; currentY--) {
					context.beginPath();
					context.lineWidth = 1;
					switch (data[0].result.grid[currentX][currentY]) {
						case 0:
							// "Unknown"
							context.fillStyle = 'rgba(133, 133, 133, 1.0)'; // '#858585';
							break;
						case 1:
							// "Open"
							context.fillStyle = 'rgba(255, 255, 255, 1.0)'; // '#FFFFFF';
							break;
						case 2:
							// "Occupied"
							context.fillStyle = 'rgba(42, 42, 42, 1.0)'; // '#2A2A2A';
							break;
						case 3:
							// "Covered"
							context.fillStyle = 'rgba(102, 0, 237, 1.0)'; // 'rgba(33, 27, 45, 0.5)'; // '#6600ED';
							break;
						default:
							context.fillStyle = '#ff9b9b';
							break;
					}
					context.rect(currentY - 1 * pixelsPerGrid, currentX - 1 * pixelsPerGrid, pixelsPerGrid, pixelsPerGrid);
					context.fill();
				}
			}
			alert("Skill finished! Successfully obtained and drew a map!");
		}

		// Open the connection to your robot.
		
		socket.Connect();
	</script>
</body>
</html>
```