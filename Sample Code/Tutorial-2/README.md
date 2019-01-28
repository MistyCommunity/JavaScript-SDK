## Tutorial 2: Using Sensors, WebSockets, and Locomotion

Read this tutorial in the documentation at [docs.mistyrobotics.com](https://docs.mistyrobotics.com/onboarding/creating-skills/writing-skill/#tutorial-2-using-sensors-websockets-and-locomotion)

In this tutorial, we write a skill that commands Misty to drive in a straight line for a designated period of time and stop if she encounters an object in her path. We do this by combining Misty’s `DriveTime` locomotion command with information received from the `TimeOfFlight` and `LocomotionCommand` WebSocket connections. In this tutorial, you’ll learn:
* How to subscribe to data from Misty’s WebSocket connections
* How to use the `lightSocket.js` helper tool
* How to write callbacks that use data from WebSocket connections to allow Misty to make decisions about what to do in different situations

Before you write any code, connect Misty to your home network and make sure you know her IP address. You can see how to get this information in the first tutorial above.

### Setting Up Your Project

In addition to Axios, this project uses the `lightSocket.js` helper tool to simplify the process of subscribing to Misty’s WebSocket streams. You can download this tool from our [GitHub repository](https://github.com/MistyCommunity/MistyI/tree/master/Skills/Tools/javascript). Save the `lightSocket.js` file to a “tools” or “assets” folder in your project.

To set up your project, create a new .html document. Give it a title, and include references to `lightSocket.js` and a CDN for the Axios library in the `<head>` section. We write the code for commanding Misty within `<script>` tags in the `<body>` section of this document.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Remote Command Tutorial 2</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Include references to a CDN for the Axios library and the local path where lightSocket.js is saved in the <head> of your document -->
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="<local-path-to-lightSocket.js"></script>
    </head>
<body>
    <script>
    // The code for commanding Misty will go here!
    </script>
</body>
``` 

### Writing the Code

Within `<script>` tags in the `<body>` of your document, declare a constant variable `ip` and set its value to a string with your robot’s IP address. We use this variable to send commands to Misty.

```html
<body>
    <script>

    // Declare a constant variable and set its value to a string with your robot’s IP address.
    const ip = "<robotipaddress>";

    </script>
</body>

```

#### Opening a Connection

Create a new instance of `LightSocket`  called `socket`. The `socket` instance takes as parameters the IP address of your robot and two optional callback functions. The first callback triggers when a connection is opened, and the second triggers when it’s closed. Pass `ip` and a function called `openCallback` to the new instance of `LightSocket`. Below these declarations, declare the `openCallback` function.

```html
<body>
    <script>

    const ip = "<robotipaddress>";

    // Create a new instance of LightSocket called socket. Pass as arguments the ip variable and a function named openCallback.
    let socket = new LightSocket(ip, openCallback);

    /* COMMANDS */

    // Define the function passed as the callback to the new instance of LightSocket. This is the code that executes when socket opens a connection to your robot.
    function openCallback() {

    }

    </script>
</body>
```

Once a connection is opened, we want to do three things:
* Subscribe to the `TimeOfFlight` WebSocket.
* Subscribe to the `LocomotionCommand` WebSocket.
* Send Misty a `DriveTime` command.

We write the code for this inside the `openCallback` function.

#### Subscribing to WebSockets

Let's start by subscribing to Misty’s `TimeOfFlight` and `LocomotionCommand` WebSocket connections.

The `TimeOfFlight` WebSocket sends data from the time-of-flight (TOF) sensors around Misty’s base. These sensors tell Misty how far objects are away from her, or if she's about to drive off a ledge. For this program, we’re interested in receiving data from Misty’s front center TOF sensor. This sensor points straight forward in Misty’s direction of travel.

The instance of `LightSocket` we’ve created (called `socket`) uses the `Subscribe` method to subscribe to WebSocket connections. The `Subscribe` method takes 8 parameters.

```JavaScript
socket.Subscribe(eventName, msgType, debounceMs, property, inequality, value, [returnProperty], [eventCallback])
```

Note that many of these parameters correlate with the values required in `subscribeMsg`, described in the documentation [here](https://docs.mistyrobotics.com/onboarding/creating-skills/writing-skill/#subscribing-amp-unsubscribing-to-a-websocket). `LightSocket` uses the parameters you pass to it to generate a message similar to this.

To subscribe to the data stream from `TimeOfFlight`, call the `Subscribe()` method on `socket`. Pass the following for each parameter:

1. `eventName` is a string that designates the name you would like to give this event. Choose a unique name that indicates the function the event serves. Let’s call our event `"CenterTimeOfFlight"`.
2. `msgType` is a string that specifies the WebSocket data stream to subscribe to. We’re subscribing to Misty’s `"TimeOfFlight"` WebSocket.
3. `debounceMs` specifies how often in milliseconds Misty should send a message with `TimeOfFlight` data. Enter `100` to receive a message every tenth of a second. At the speed Misty will be traveling, this should be should be precise enough for us to be able to execute a `Stop` command before Misty collides with an object in her path.
4. The fourth, fifth, and sixth parameters form a comparison statement that specifies event conditions to filter out unwanted messages. The `TimeOfFlight` WebSocket data stream can send data from all of Misty's TOF sensors, but we only need data from her front center sensor. Pass `"SensorPosition"` for the `property` parameter to specify we want data from a specific sensor.
5. `inequality` is a string that sets a comparison operater to specify the conditions of events to recieve messages about. In this case we use `"=="`.
6. `value` is a string that specifies which value of the `property` parameter to check against. We want to receive information for TOF sensors where the value of the `"SensorPosition"` property is `”Center”`. 
7. `returnProperty` is an optional parameter. We don't need to pass an argument for this parameter for our subscription to `TimeOfFlight`. Enter `null`.
8. `eventCallback` is the callback function that triggers when WebSocket data is received. We’ll name this function `_centerTimeOfFlight` to correspond to the name we provided for this event.  The **Callbacks** section of this tutorial describes how to write the code for this function.


```html
<body>
    <script>

    const ip = "<robotipaddress>";

    let socket = new LightSocket(ip, openCallback);

    /* COMMANDS */

    function openCallback() {

        // Subscribe to a new event called "CenterTimeOfFlight" that returns data when "TimeOfFlight" events are triggered. Pass arguments to make sure this event returns data for the front center time-of-flight sensor every 100 milliseconds. Pass the callback function _centerTimeOfFlight as the final argument.
        socket.Subscribe("CenterTimeOfFlight", "TimeOfFlight", 100, "SensorPosition", "==", "Center", null, _centerTimeOfFlight);
    }

    </script>
</body>
```

The `LocomotionCommand` WebSocket sends data every time the robot’s linear or angular velocity changes (see the documentation [here](https://docs.mistyrobotics.com/onboarding/creating-skills/writing-skill/#websocket-types-amp-sample-data) for more information). We use this WebSocket to learn when Misty has stopped moving.

As with `TimeOfFlight`, we need to pass eight parameters to `socket.Subscribe()` to receive data from `LocomotionCommand`. However, because we only want to know whether Misty’s movement has changed, we don’t need to filter our results to specific event properties. We only need to pass arguments for `eventName` (`“LocomotionCommand”`), the WebSocket name (also `”LocomotionCommand”`), and the `eventCallback` function, which we call `_locomotionCommand`. Enter `null` for all of the other parameters.

```html
<body>
    <script>

    const ip = "<robotipaddress>";

    let socket = new LightSocket(ip, openCallback);

    /* COMMANDS */

    function openCallback() {

        socket.Subscribe("CenterTimeOfFlight", "TimeOfFlight", 100, "SensorPosition", "==", "Center", null, _centerTimeOfFlight);

        // Subscribe to a new event called "LocomotionCommand" that returns data when Misty's angular or linear velocity changes. Pass the callback function _locomotionCommand as the final argument.
        socket.Subscribe("LocomotionCommand", "LocomotionCommand", null, null, null, null, null, _locomotionCommand);

    }
    </script>
</body>
```

#### Sending Commands

After we’ve subscribed to these WebSockets, we issue the command for Misty to drive by using Axios to send a POST request to the `DriveTime` endpoint. This endpoint accepts values for three properties: `LinearVelocity`, `AngularVelocity`, and `TimeMS`. Inside the `OpenCallback` function, create a data `object` with the following key/value pairs to send with the REST command:
* Set `LinearVelocity` to `50` to tell Misty to drive forward at a moderate speed.
* Set `AngularVelocity` to `0`, so Misty drives straight without turning.
* Set `TimeMS` to `5000` to specify that Misty should drive for five seconds. 

```html
<body>
    <script>

    const ip = "<robotipaddress>";

    let socket = new LightSocket(ip, openCallback);

    /* COMMANDS */

    function openCallback() {

        socket.Subscribe("CenterTimeOfFlight", "TimeOfFlight", 100, "SensorPosition", "==", "Center", null, _centerTimeOfFlight);

        socket.Subscribe("LocomotionCommand", "LocomotionCommand", null, null, null, null, null, _locomotionCommand);

        // Assemble the data to send with the DriveTime command.
        let data = {
            LinearVelocity: 50,
            AngularVelocity: 0,
            TimeMS: 5000
        };

    }
    </script>
</body>
```

**Note:** You can learn more about `DriveTime` and how the parameters affect Misty’s movement in the API section of this documentation.

Pass the URL for the `DriveTime` command along with this `data` object to the `axios.post()` method. Use a `then()` method to handle a successful response and `catch()` to handle any errors.

```html
<body>
    <script>

    const ip = "<robotipaddress>";

    let socket = new LightSocket(ip, openCallback);

    /* COMMANDS */

    function openCallback() {

        socket.Subscribe("CenterTimeOfFlight", "TimeOfFlight", 100, "SensorPosition", "==", "Center", null, _centerTimeOfFlight);

        socket.Subscribe("LocomotionCommand", "LocomotionCommand", null, null, null, null, null, _locomotionCommand);

        let data = {
            LinearVelocity: 50,
            AngularVelocity: 0,
            TimeMS: 5000
        };

        // Use axios.post() to send the data to the DriveTime REST API endpoint.
        axios.post("http://" + ip + "/api/drive/time", data)
            // Use .then() to handle a successful response.
            .then(function (response) {
                // Print the results of the DriveTime command to the console.
                console.log(`DriveTime was a ${response.data[0].status}`);
            })
            // Use .catch() to handle errors.
            .catch(function (error) {
                // Print any errors related to the DriveTime command to the console.
                console.log(`There was an error with the request ${error}`);
            });
    };

    </script>
</body>
```

#### Setting up Callbacks
Now that we’ve written the code to subscribe to the WebSocket connections and send the `DriveTime` command, we’re ready to write the callback functions `_centerTimeOfFlight` and `_locomotionCommand`. These functions trigger when Misty sends data for the events we’ve subscribed to.

Start with `_centerTimeOfFlight`, the callback function passed to `Subscribe()` for the `TimeOfFlight` WebSocket connection. We subscribe to the `CenterTimeOfFlight` event in order to examine incoming data and tell Misty what to do when she detects an object in her path. Data from this WebSocket is passed directly into the `_centerTimeOfFlight` callback function. `_centerTimeOfFlight` should parse this data and send Misty a `Stop` command if an object is detected in her path.

We define our callbacks above the section where we define our commands. Create a function called `_centerTimeOfFlight` with a single parameter called `data`. This parameter represents the data passed to Misty when the `CenterTimeOfFlight` event triggers.

```html
<body>
    <script>

    const ip = "<robotipaddress>";

    let socket = new LightSocket(ip, openCallback);

    /* CALLBACKS */

    // Define the callback function that will be passed when we subscribe to the CenterTimeOfFlight event.
    let _centerTimeOfFlight = function (data) {

    };

    /* COMMANDS */

    function openCallback() {

        socket.Subscribe("CenterTimeOfFlight", "TimeOfFlight", 100, "SensorPosition", "==", "Center", null, _centerTimeOfFlight);

        socket.Subscribe("LocomotionCommand", "LocomotionCommand", null, null, null, null, null, _locomotionCommand);

        let data = {
            LinearVelocity: 50,
            AngularVelocity: 0,
            TimeMS: 5000
        };

        axios.post("http://" + ip + "/api/drive/time", data)
            .then(function (response) {
                console.log(`DriveTime was a ${response.data[0].status}`);
            })
            .catch(function (error) {
                console.log(`There was an error with the request ${error}`);
            });
    };

    </script>
</body>
```

When you subscribe to an event, some messages come through that don’t contain event data. These are typically registration or error messages. To ignore these messages, we write the code for our callback function in `try` and `catch` statements. 

```html
<body>
    <script>

    const ip = "<robotipaddress>";

    let socket = new LightSocket(ip, openCallback);

    /* CALLBACKS */

    let _centerTimeOfFlight = function (data) {
        // Use try and catch statements to handle exceptions and unimportant messages from the WebSocket data stream.
        try {

        };
        catch(e){

        };
    };

    /* COMMANDS */

    function openCallback() {

        socket.Subscribe("CenterTimeOfFlight", "TimeOfFlight", 100, "SensorPosition", "==", "Center", null, _centerTimeOfFlight);

        socket.Subscribe("LocomotionCommand", "LocomotionCommand", null, null, null, null, null, _locomotionCommand);

        let data = {
            LinearVelocity: 50,
            AngularVelocity: 0,
            TimeMS: 5000
        };

        axios.post("http://" + ip + "/api/drive/time", data)
            .then(function (response) {
                console.log(`DriveTime was a ${response.data[0].status}`);
            })
            .catch(function (error) {
                console.log(`There was an error with the request ${error}`);
            });
    };

    </script>
</body>
```

Inside the `try` statement, instantiate a `distance` variable. `distance` stores a value representing the distance from Misty in meters an object has been detected by her front center time-of-flight sensor. This value is stored in the `data` response at `data.message.distanceInMeters`. Log `distance` to the console.

```html
<body>
    <script>

    const ip = "<robotipaddress>";

    let socket = new LightSocket(ip, openCallback);

    /* CALLBACKS */

    let _centerTimeOfFlight = function (data) {
        try {
            // Instantiate a distance variable to store the value representing the distance from Misty in meters an object has been detected by her front center time-of-flight sensor. 
            let distance = data.message.distanceInMeters;
            // Log this distance to the console.
            console.log(distance);
        };
        catch(e){

        };
    };

    /* COMMANDS */

    function openCallback() {

        socket.Subscribe("CenterTimeOfFlight", "TimeOfFlight", 100, "SensorPosition", "==", "Center", null, _centerTimeOfFlight);

        socket.Subscribe("LocomotionCommand", "LocomotionCommand", null, null, null, null, null, _locomotionCommand);

        let data = {
            LinearVelocity: 50,
            AngularVelocity: 0,
            TimeMS: 5000
        };

        axios.post("http://" + ip + "/api/drive/time", data)
            .then(function (response) {
                console.log(`DriveTime was a ${response.data[0].status}`);
            })
            .catch(function (error) {
                console.log(`There was an error with the request ${error}`);
            });
    };

    </script>
</body>
```

We only want Misty to stop when `distance` is a very small value, indicating she is very close to an object. To do this, write an `if` statement to check if `distance < 0.2`. Misty keeps driving if `distance` is greater than `0.2` meters. If `distance` is `undefined`, an exception occurs and is passed to the `catch` statement. This is the case when registration or error messages are received through the WebSocket. By using a `try` statement, our callback functions behave appropriately when the “right” messages come through, and continue execution if they cannot act on the data they receive.

If `distance` is a value less than `0.2`, use Axios to issue a POST request to the endpoint for the `Stop` command: `"http://" + ip + "/api/drive/stop"`. This endpoint does not require parameters, so we can omit the second parameter of `axios.post()`. Use `then()` and `catch()` to log successful responses and catch potential errors.

```html
<body>
    <script>

    const ip = "<robotipaddress>";

    let socket = new LightSocket(ip, openCallback);

    /* CALLBACKS */

    let _centerTimeOfFlight = function (data) {
        try {
            let distance = data.message.distanceInMeters;
            console.log(distance);
            // Write an if statement to check if the distance is smaller than 0.2 meters.
            if (distance < 0.2) {
                // If the distance is shorter than 
                axios.post("http://" + ip + "/api/drive/stop")
                    .then(function (response) {
                        // Print the results of the Stop command to the console.
                        console.log(`Stop was a ${response.data[0].status}`);
                    })
                    .catch(function (error) {
                        // Print errors related to the Stop command to the console.
                        console.log(`There was an error with the request ${error}`);
                    });
				}
        };
        catch(e){

        };
    };

    /* COMMANDS */

    function openCallback() {

        socket.Subscribe("CenterTimeOfFlight", "TimeOfFlight", 100, "SensorPosition", "==", "Center", null, _centerTimeOfFlight);

        socket.Subscribe("LocomotionCommand", "LocomotionCommand", null, null, null, null, null, _locomotionCommand);

        let data = {
            LinearVelocity: 50,
            AngularVelocity: 0,
            TimeMS: 5000
        };

        axios.post("http://" + ip + "/api/drive/time", data)
            .then(function (response) {
                console.log(`DriveTime was a ${response.data[0].status}`);
            })
            .catch(function (error) {
                console.log(`There was an error with the request ${error}`);
            });
    };

    </script>
</body>
```

The `_centerTimeOfFlight` callback triggers every time data from Misty’s front center sensor is received. If an object is detected close enough to the sensor, a `Stop` command is issued, and Misty stops before colliding with the object.

The purpose of the `_locomotionCommand` callback function is to “clean up” our skill when the program stops executing. Whenever you subscribe to a WebSocket, you should unsubscribe when you are done with it, so Misty stops sending data. Our program can end in two ways:

* Misty stops driving when she detects an object in her path.
* Misty does not detect an object in her path and stops driving after five seconds.

The `LocomotionCommand` event sends data whenever linear or angular velocity changes, including when Misty starts moving when the program starts. We want to unsubscribe from WebSocket connections when Misty stops **and** the value of `LinearVelocity` is `0`. Declare a function called `_locomotionCommand`, and pass it a parameter for the `data` received by the `LocomotionCommand` WebSocket. We only want to unsubscribe when Misty stops, so we add the condition that `linearVelocity` should be `0` to an `if` statement. As with the `_centerTimeOfFlight` callback, place this condition inside a `try` statement, and place a `catch` statement to handle exceptions at the end of the function.

```html
<body>
    <script>

    const ip = "<robotipaddress>";

    let socket = new LightSocket(ip, openCallback);

    /* CALLBACKS */

    let _centerTimeOfFlight = function (data) {
        try {
            let distance = data.message.distanceInMeters;
            console.log(distance);
            if (distance < 0.2) {
                axios.post("http://" + ip + "/api/drive/stop")
                    .then(function (response) {
                        console.log(`Stop was a ${response.data[0].status}`);
                    })
                    .catch(function (error) {
                        console.log(`There was an error with the request ${error}`);
                    });
				}
        };
        catch(e){

        };
    };

    // Define the callback function that will be passed when we subscribe to the LocomotionCommand event.
    let _locomotionCommand = function (data) {
        // Use try and catch statements to handle exceptions and unimportant messages from the WebSocket data stream.
        try {
            // Use an if statement to check if Misty has stopped moving
            if (data.message.linearVelocity === 0) {
            }
        }
        catch(e) {}
    };

    /* COMMANDS */

    function openCallback() {

        socket.Subscribe("CenterTimeOfFlight", "TimeOfFlight", 100, "SensorPosition", "==", "Center", null, _centerTimeOfFlight);

        socket.Subscribe("LocomotionCommand", "LocomotionCommand", null, null, null, null, null, _locomotionCommand);

        let data = {
            LinearVelocity: 50,
            AngularVelocity: 0,
            TimeMS: 5000
        };

        axios.post("http://" + ip + "/api/drive/time", data)
            .then(function (response) {
                console.log(`DriveTime was a ${response.data[0].status}`);
            })
            .catch(function (error) {
                console.log(`There was an error with the request ${error}`);
            });
    };

    </script>
</body>
```

If `data.message.linearVelocity === 0`, the program should unsubscribe from the WebSocket connections we’ve opened. Write commands to unsubscribe from the `DriveTime` and `LocomotionCommand` WebSocket connections, and log a message to the console so you can verify that this only happens when `linearVelocity` is indeed `0`.

```html
<body>
    <script>

    const ip = "<robotipaddress>";

    let socket = new LightSocket(ip, openCallback);

    /* CALLBACKS */

    let _centerTimeOfFlight = function (data) {
        try {
            let distance = data.message.distanceInMeters;
            console.log(distance);
            if (distance < 0.2) {
                axios.post("http://" + ip + "/api/drive/stop")
                    .then(function (response) {
                        console.log(`Stop was a ${response.data[0].status}`);
                    })
                    .catch(function (error) {
                        console.log(`There was an error with the request ${error}`);
                    });
				}
        };
        catch(e){

        };
    };

    let _locomotionCommand = function (data) {
        try {
            if (data.message.linearVelocity === 0) {
                // Print a message to the console for debugging.
                console.log("LocomotionCommand received linear velocity as", data.message.linearVelocity);
                // Unsubscribe from the CenterTimeOfFlight and LocomotionCommand events.
                socket.Unsubscribe("CenterTimeOfFlight");
                socket.Unsubscribe("LocomotionCommand");                
            }
        }
        catch(e) {}
    };

    /* COMMANDS */

    function openCallback() {

        socket.Subscribe("CenterTimeOfFlight", "TimeOfFlight", 100, "SensorPosition", "==", "Center", null, _centerTimeOfFlight);

        socket.Subscribe("LocomotionCommand", "LocomotionCommand", null, null, null, null, null, _locomotionCommand);

        let data = {
            LinearVelocity: 50,
            AngularVelocity: 0,
            TimeMS: 5000
        };

        axios.post("http://" + ip + "/api/drive/time", data)
            .then(function (response) {
                console.log(`DriveTime was a ${response.data[0].status}`);
            })
            .catch(function (error) {
                console.log(`There was an error with the request ${error}`);
            });
    };

    </script>
</body>
```

### Putting It All Together

At the bottom of the script, call `socket.Connect()`. When the connection is established, the `OpenCallback` function executes to subscribe to WebSocket connections and send Misty a `DriveTime` command. Data received through WebSocket connections is passed to the `_centerTimeOfFlight` and `_locomotionCommand` callback functions.

```html
<body>
    <script>

    const ip = "<robotipaddress>";

    let socket = new LightSocket(ip, openCallback);

    /* CALLBACKS */

    let _centerTimeOfFlight = function (data) {
        try {
            let distance = data.message.distanceInMeters;
            console.log(distance);
            if (distance < 0.2) {
                axios.post("http://" + ip + "/api/drive/stop")
                    .then(function (response) {
                        console.log(`Stop was a ${response.data[0].status}`);
                    })
                    .catch(function (error) {
                        console.log(`There was an error with the request ${error}`);
                    });
				}
        };
        catch(e){

        };
    };

    let _locomotionCommand = function (data) {
        try {
            if (data.message.linearVelocity === 0) {
                console.log("LocomotionCommand received linear velocity as", data.message.linearVelocity);
                socket.Unsubscribe("CenterTimeOfFlight");
                socket.Unsubscribe("LocomotionCommand");                
            }
        }
        catch(e) {}
    };

    /* COMMANDS */

    function openCallback() {

        socket.Subscribe("CenterTimeOfFlight", "TimeOfFlight", 100, "SensorPosition", "==", "Center", null, _centerTimeOfFlight);

        socket.Subscribe("LocomotionCommand", "LocomotionCommand", null, null, null, null, null, _locomotionCommand);

        let data = {
            LinearVelocity: 50,
            AngularVelocity: 0,
            TimeMS: 5000
        };

        axios.post("http://" + ip + "/api/drive/time", data)
            .then(function (response) {
                console.log(`DriveTime was a ${response.data[0].status}`);
            })
            .catch(function (error) {
                console.log(`There was an error with the request ${error}`);
            });
    };

        // Open the connection to your robot. When the connection is established, the OpenCallback function executes to subscribe to WebSockets and send Misty a DriveTime command. Data recieved through these WebSockets is passed to the _centerTimeOfFlight and _locomotionCommand callback functions.
        socket.Connect();

    </script>
</body>
```


**Congratulations!** You’ve just written another skill for Misty. Save your .html document and open it in a web browser to watch Misty go. When the document loads, the program:
* Connects with Misty.
* Sends a `DriveTime` command for Misty to drive forward for 5 seconds.
* Subscribes to `TimeOfFlight` events to detect if an object is in Misty’s path and sends a `Stop` command if so.
* Subscribes to `LocomotionCommand` to detect when Misty has come to a stop and unsubscribe from the WebSocket connections.

### Full Sample

See the full .html document for reference.