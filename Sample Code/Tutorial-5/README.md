## Tutorial 5: Taking Pictures

Read this tutorial in the documentation at [docs.mistyrobotics.com]( https://docs.mistyrobotics.com/onboarding/creating-skills/writing-skill/#tutorial-5-taking-pictures)

This tutorial describes how to write a remote-running program for Misty that takes a photo with her 4K camera and saves it to her local storage when she detects a face in her field of vision. It teaches
* how to subscribe to the `ComputerVision` WebSocket
* how to engage with Misty’s face detection capabilities
* how to use the `TakePicture` command to take photos with Misty’s 4K camera and save them to your robot
* how to control the flow of a program to trigger commands when specific environmental circumstances are met

### Setting Up Your Project
This project uses the Axios library and the `lightSocket.js` helper tool to handle requests and simplify the process of subscribing to Misty’s WebSocket connections. You can download this tool from our [GitHub repository](https://github.com/MistyCommunity/MistyI/tree/master/Skills/Tools/javascript). Save the `lightSocket.js` file to a “tools” or “assets” folder in your project.

To set up your project, create a new HTML document. Give it a title and include references to `lightSocket.js` and a CDN for the Axios library in the `<head>` section. We write the code for commanding Misty within `<script>` tags in the `<body>` section of this document.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Remote Command Tutorial 5</title>
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
Within `<script>` tags in the `<body>` of your document, declare a constant variable `ip` and set its value to a string with your robot’s IP address. We use this variable to send commands to Misty. Other global variables are declared later in the project.

```js
/* GLOBAL */

// Declare a global variable ip and set its value to a string with your robot's IP address.
const ip = <robotipaddress>;
```

Next, define a function called `sleep()`. We use this function to help control the flow of the program. The `sleep()` function creates and returns a promise that resolves when `setTimeout()` expires after a designated number of milliseconds. Define `sleep()` beneath the global variables so it can be referenced throughout the program.

``` js
/*TIMEOUT */

// Define a helper function called sleep that can pause code execution for a set period of time.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

Create an new instance of `LightSocket`  called `socket`. This instance of `LightSocket` takes as parameters the IP address of your robot and two optional callback functions (the first triggers when a connection is opened, and the second triggers when it’s closed). Pass the `ip` variable and a function called `openCallback()` to `socket` as the first and second parameters. 

```js
/* GLOBALS */

const ip = "<robotipaddress>";
// Create a new instance of LightSocket called socket. Pass as arguments the ip variable and a function named openCallback.
let socket = new LightSocket(ip, openCallback);

```

Declare the `openCallback()` function. Prefix the definition of `openCallback()` with the keyword `async()` to declare it as an asynchronous function and enable the use of the `sleep()` function.

```js
/* CALLBACKS */

// Declare the openCallback() function. Prefix the definition of openCallback() with the keyword async() to declare it as an asynchronous function and enable the use of the sleep() function.
async function openCallback() {

}
```

To keep track of whether we are currently subscribed to a `ComputerVision` event, declare a global variable called `subscribed` near the global `ip` variable. 

```js
/* GLOBALS */

const ip = "<robotipaddress>";
let socket = new LightSocket(ip, openCallback);
// To keep track of whether we are currently subscribed to a ComputerVision event, declare a global variable called subscribed near the global ip variable.
let subscribed;
```


Set the value of `subscribed` to `false` in the beginning of the `openCallback()` function. 

```js
/* CALLBACKS */

async function openCallback() {
    // Set the value of subscribed to false to show that the subscription has not been established.
    subscribed = false;
}
```

Each time a picture is taken, we unsubscribe from the `ComputerVision` WebSocket, pause execution, and re-subscribe to the WebSocket. We do this to prevent Misty from taking dozens of pictures of the same person every time she detects a face. To manage this, we send a command to unsubscribe from the `"ComputerVision"` event before each attempt to establish a connection. 

Inside `openCallback()`, call `socket.Unsubscribe()` and pass in the `"ComputerVision"` event name. After unsubscribing, call `sleep()` (prefixed with the keyword `await`) and pass in the value `8000`. This tells  the program to pause for 8 seconds, which is how long we want Misty to wait before re-subscribing to `ComputerVision` and sending more face detection event data.

```js
/* CALLBACKS */

async function openCallback() {
    subscribed = false;
    // Unsubscribe from the ComputerVision event.
    socket.Unsubscribe("ComputerVision");
    // Pause execution while the event subscription ends.
    await sleep(8000);
}
```

Next, call `socket.Subscribe()`. The `socket.Subscribe()` method takes eight arguments. For more information about what each of these arguments does, see the documentation on using the `lightSocket.js` tool [here](https://docs.mistyrobotics.com/onboarding/creating-skills/writing-skill/#using-the-lightsocket-js-helper).

```js
socket.Subscribe(eventName, msgType, debounceMs, property, inequality, value, [returnProperty], [eventCallback])
```

When you call `socket.Subscribe()`, pass `"ComputerVision"` for the `eventName` argument, pass `"ComputerVision"` for `msgType`, pass `1000` for `debounceMS`, and pass `"_ComputerVision"` for `eventCallback`. Pass `null` for all other arguments. 

```js
/* CALLBACKS */

async function openCallback() {
    subscribed = false;
    socket.Unsubscribe("ComputerVision");
    await sleep(8000);
    // Call socket.Subscribe(). Pass "ComputerVision" for the eventName argument, pass "ComputerVision" for msgType, pass 1000 for debounceMS, and pass "_ComputerVision" for eventCallback. Pass null for all other arguments.
    socket.Subscribe("ComputerVision", "ComputerVision", 1000, null, null, null, null, _ComputerVision);

}
```

Use the keyword `async` to define the `_ComputerVision()` callback that runs when a `ComputerVision` event triggers. This function takes a `data` argument, which holds the data from the event message. Write code to print a message to the console each time the callback triggers, including the message response data.

```js
// Use the keyword async to define the _ComputerVision() callback that runs when a ComputerVision event triggers. This function takes a data argument, which holds the data from the event message. 
async function _ComputerVision(data) {
    // Write code to print a message to the console each time the callback triggers, including the message response data.
    console.log("CV callback called: ", data);
```

When we establish a connection, we want to update the value of `subscribed` to reflect that we are subscribed to the event. Use an `if` statement to check if `subscribed` is `false`. If it is, set it to `true`. 

```js
async function _ComputerVision(data) {
    console.log("CV callback called: ", data);
    // When we establish a connection, we want to update the value of subscribed to reflect that we are subscribed to the event. Use an if statement to check if subscribed is false. If it is, set it to true.
    if (!subscribed) {
        subscribed = true;
    }
}
```

As Misty takes pictures of the faces she recognizes, we unsubscribe and re-subscribe to "ComputerVision". However, because it’s okay for face detection to remain active even when we are not subscribed to `"ComputerVision"` event messages, we only need to send the command to start face detection once.  We can accomplish this by using a global variable called `firstTime` that we initialize with a value of `true`. 

```js
/* GLOBALS */
const ip = "<robotipaddress>";
// We only need to send the command to start face detection once. We can accomplish this by using a global variable called firstTime that we initialize with a value of true.
let firstTime = true;
let subscribed;
let socket = new LightSocket(ip, openCallback);
```

When the callback triggers, use an `if` statement to check if `firstTime` is `true`. If it is, send a POST request to the endpoint for the `StartFaceDetection` command. Use `catch()` to handle and log any errors you receive when sending the command. Set `firstTime` to `false` and leave it that way for the remainder of the program’s execution.

```js
async function _ComputerVision(data) {
    console.log("CV callback called: ", data);
    if (!subscribed) {
        subscribed = true;
        // Use an if statement to check if firstTime is true. If it is, send a POST request to the endpoint for the StartFaceDetection command. Use catch() to handle and log any errors you receive when sending the command. Set firstTime to false and leave it that way for the remainder of the program’s execution.
        if (firstTime) {
            axios.post("http://" + ip + "/api/beta/faces/recognition/start")
                .catch((err) => {
                    console.log(err);
                });
            // Update firstTime to tell future callbacks the first callback has already occurred.
            firstTime = false;
        }
    }
}
```

The first message we receive when we subscribe to the `ComputerVision` WebSocket is a registration message that does not contain data relevant to our program. When the `_ComputerVision()` callback triggers for the first time, we want to send the command to start face detection, but we want to prevent execution of the rest of the code to avoid processing this registration message. To do this, within the `if` statement checking the value of `subscribed`, use `return` to exit the callback and take no further action. 

```js
async function _ComputerVision(data) {
    console.log("CV callback called: ", data);
    if (!subscribed) {
        subscribed = true;
        if (firstTime) {
            axios.post("http://" + ip + "/api/beta/faces/recognition/start")
                .catch((err) => {
                    console.log(err);
                });
            firstTime = false;
        }
        // Use return to exit the callback.
        return
    }
}
```

The rest of the callback function handles cases where relevant data comes through. This occurs whenever Misty detects a face in her field of vision. Because the program pauses each time a picture is taken, this section of the callback doesn’t execute more frequently than every 8 seconds. 

To have Misty take a picture, use `axios.get()` to send a GET request to the endpoint for the `TakePicture`  command. This endpoint accepts values for parameters that specify whether the image data should be returned as a Base64 string, what name the image file should be given, what size the image should be, whether to display the image on Misty’s screen, and whether to overwrite an image with the same file name if one exists on your robot. [Read the documentation on this endpoint](https://docs.mistyrobotics.com/apis/api-reference/rest/#takepicture-alpha) for detailed descriptions of these parameters. When you call `axios.get()`, pass in the endpoint for the `TakePicture` command as the first argument. For the second argument, pass in a `params` object with the following key, value pairs:
* Set `Base64` to `null`. This tells Misty not to return the image data as a base64 string. 
* Set `FileName` to the variable `fileName`. Declaring a value for this parameter tells Misty to save the photo to her file system. The photo is saved with a name that matches the value stored in the `fileName` variable, which is defined later in this project. 
* Set `Width` and `Height` to `1200` and `1600`, respectively. These sizes match the resolution of the photo taken by the 4K camera. 
* Set `DisplayOnScreen` to `false`. We don’t want Misty to display these photos on her screen after she takes them. 
* Set `OverwriteExisting` to `true` so Misty overwrites any old images that have the same name as newly captured photos.

```js
async function _ComputerVision(data) {
    console.log("CV callback called: ", data);
    if (!subscribed) {
        subscribed = true;
        if (firstTime) {
            axios.post("http://" + ip + "/api/beta/faces/recognition/start")
                .catch((err) => {
                    console.log(err);
                });
            firstTime = false;
        }
        return
    }
    // Use axios.get() to send a GET request to the endpoint for the TakePicture command. This endpoint accepts values for parameters that specify whether the image data should be returned as a Base64 string, what name the image file should be given, what size the image should be, whether to display the image on Misty’s screen, and whether to overwrite an image with the same file name if one exists on your robot.
    axios.get("http://" + ip + "/api/alpha/camera", {
        params: {
            Base64: null,
            FileName: fileName,
            Width: 1200,
            Height: 1600,
            DisplayOnScreen: false,
            OverwriteExisting: true
        }
    })
}
```

Use a `then()` method to log the response, as well as a message indicating the image has been saved with the specified file name.

```js
async function _ComputerVision(data) {
    console.log("CV callback called: ", data);
    if (!subscribed) {
        subscribed = true;
        if (firstTime) {
            axios.post("http://" + ip + "/api/beta/faces/recognition/start")
                .catch((err) => {
                    console.log(err);
                });
            firstTime = false;
        }
        return
    }
    axios.get("http://" + ip + "/api/alpha/camera", {
        params: {
            Base64: null,
            FileName: fileName,
            Width: 1200,
            Height: 1600,
            DisplayOnScreen: false,
            OverwriteExisting: true
        }
    })
    // Use a then() method to log the response, as well as a message indicating the image has been saved with the specified file name.
        .then(function (res) {
            console.log(res);
            console.log("Image saved with fileName: '" + fileName + "'");
        });
}
```

We define `fileName` above this GET request. For this project, we want Misty to take pictures and save them with the date and time the photo was taken. To accomplish this, we use the JavaScript built-in [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object. Instantiate a new `Date` object, then call the method `toLocaleString()` to convert the date and time into a string. Windows systems omit certain characters from file names, so we need to use the `replace()` method and pass in some regular expressions to modify the string to an acceptable format and make it easier to read. (**Note:** This code is okay to leave in your program if you are running it on a Mac or Unix system.) These regular expressions replace semicolons with periods, replace spaces with underscores, remove commas, and append the file name with `"_Face"` to indicate that these are images of faces.

```js
async function _ComputerVision(data) {
    console.log("CV callback called: ", data);
    if (!subscribed) {
        subscribed = true;
        if (firstTime) {
            axios.post("http://" + ip + "/api/beta/faces/recognition/start")
                .catch((err) => {
                    console.log(err);
                });
            firstTime = false;
        }
        return
    }
    // Define the name to save the image with. For this project, we use the JavaScript built-in Date object to save pictures with the date and time they were taken. Windows systems omit certain characters from file names, so we need to use the replace() method and pass in some regular expressions to modify the string to an acceptable format and make it easier to read. These regular expressions replace semicolons with periods, replace spaces with underscores, remove commas, and append the file name with "_Face" to indicate that these are images of faces.
    let fileName = new Date().toLocaleString().replace(/[/]/g, ".").replace(/[:]/g, ".").replace(/[ ]/g, "_").replace(",", "") + "_Face";

    axios.get("http://" + ip + "/api/alpha/camera", {
        params: {
            Base64: null,
            FileName: fileName,
            Width: 1200,
            Height: 1600,
            DisplayOnScreen: false,
            OverwriteExisting: true
        }
    })
        .then(function (res) {
            console.log(res);
            console.log("Image saved with fileName: '" + fileName + "'");
        });
}
```

After the GET request, call `openCallback()` to start the process over again. To catch and log errors, wrap a `try, catch` statement around the code block that defines the value of `fileName`, makes the GET request, and repeats the call to `openCallback()`.

```js
async function _ComputerVision(data) {
    console.log("CV callback called: ", data);
    if (!subscribed) {
        subscribed = true;
        if (firstTime) {
            axios.post("http://" + ip + "/api/beta/faces/recognition/start")
                .catch((err) => {
                    console.log(err);
                });
            firstTime = false;
        }
        return
    }
    // Wrap the GET request code block in a try, catch statement to catch and log errors.
    try {
        let fileName = new Date().toLocaleString().replace(/[/]/g, ".").replace(/[:]/g, ".").replace(/[ ]/g, "_").replace(",", "") + "_Face";
        axios.get("http://" + ip + "/api/alpha/camera", {
            params: {
                Base64: null,
                FileName: fileName,
                Width: 1200,
                Height: 1600,
                DisplayOnScreen: false,
                OverwriteExisting: true
            }
        })
            .then(function (res) {
                console.log(res);
                console.log("Image saved with fileName: '" + fileName + "'");
            });
        // Call openCallback to start the process over again
        openCallback();
    }
    catch (err) {
        console.log(err);
    }
}

```

At the end of the program, call `socket.Connect()` to open the connection to the websocket.

```js
socket.Connect();
```

**Congratulations!** You’ve written a program for Misty to take a photo whenever she detects a face. 
* When the document loads, the program establishes a connection to the `ComputerVision` WebSocket. 
* Misty starts face detection and, each time she sees a face, takes a photo with her 4K camera. 
* These photos are saved to Misty’s local storage and given file names to indicate the date and time when the face was detected and the photo was taken. 
* The flow of the program is managed by global variables indicating the status of the WebSocket subscription and whether Misty has already started face recognition. 
* Each time a photo is taken, the program unsubscribes from the WebSocket, pauses for a few seconds, and then re-subscribes to the WebSocket connection to start the whole process over again.

### Full Sample

See the full .html document for reference.

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>Remote Command Tutorial 5</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- Include references to a CDN for the Axios library and the local path where lightSocket.js is saved in the <head> of your document -->
	<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
	<script src="<local-path-to-lightSocket.js>"></script>
</head>
<body>
	<script>
		/* GLOBALS */

		// Declare a global variable ip and set its value to a string with your robot's IP address.
		const ip = "<robotipaddress>";
		// We only need to send the command to start face detection once. We can accomplish this by using a global variable called firstTime that we initialize with a value of true.			
		let firstTime = true;
		// To keep track of whether we are currently subscribed to a ComputerVision event, declare a global variable called subscribed near the global ip variable.
		let subscribed;
		// Create a new instance of LightSocket called socket. Pass as arguments the ip variable and a function named openCallback.
		let socket = new LightSocket(ip, openCallback);


		/*TIMEOUT */

        // Define a helper function called sleep that can pause code execution for a set period of time.
		function sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		/* CALLBACKS */
		// Declare the openCallback() function. Prefix the definition of openCallback() with the keyword async() to declare it as an asynchronous function and enable the use of the sleep() function.
		async function openCallback() {
			// Set the value of subscribed to false to show that the subscription has not been established.
			subscribed = false;
			// Unsubscribe from the ComputerVision event.
			socket.Unsubscribe("ComputerVision");
			// Pause execution while the event subscription ends.
			await sleep(8000);
			// Call socket.Subscribe(). Pass "ComputerVision" for the eventName argument, pass "ComputerVision" for msgType, pass 1000 for debounceMS,and pass "_ComputerVision" for eventCallback. Pass null for all other arguments.
			socket.Subscribe("ComputerVision", "ComputerVision", 1000, null, null, null, null, _ComputerVision);
		}
		// Use the keyword async to define the _ComputerVision() callback that runs when a ComputerVision event triggers. This function takes a data argument, to hold the data from the event message. 
		async function _ComputerVision(data) {
			// Write code to print a message to the console each time the callback triggers, including the message response data.
			console.log("CV callback called: ", data);
			// When we establish a connection, we want to update the value of subscribed to reflect that we are subscribed to the event. Use an if statement to check if subscribed is false. If it is, set it to true.
			if (!subscribed) {
				subscribed = true;
				// Use an if statement to check if firstTime is true. If it is, send a POST request to the endpoint for the StartFaceDetection command. Use catch() to handle and log any errors you receive when sending the command. Set firstTime to false and leave it that way for the remainder of the program’s execution.
				if (firstTime) {
					axios.post("http://" + ip + "/api/beta/faces/recognition/start")
						.catch((err) => {
							console.log(err);
						});
					// Update firstTime to tell future callbacks the first callback has already occurred.
					firstTime = false;
				}
				// Use return to exit the callback.
				return
			}

			try {
				// Define the name to save the image with. For this project, we use the JavaScript built-in Date object to save photos with the date and time they were taken. Windows systems omit certain characters from file names, so we need to use the replace() method and pass in some regular expressions to modify the string to an acceptable format and make it easier to read. These regular expressions replace semicolons with periods, replace spaces with underscores, remove commas, and append the file name with "_Face" to indicate that these are images of faces.
				let fileName = new Date().toLocaleString().replace(/[/]/g, ".").replace(/[:]/g, ".").replace(/[ ]/g, "_").replace(",", "") + "_Face";
				// Use axios.get() to send a GET request to the endpoint for the TakePicture command. This endpoint accepts values for parameters that specify whether the image data should be returned as a Base64 string, what name the image file should be given, what size the image should be, whether to display the image on Misty’s screen, and whether to overwrite an image with the same file name if one exists on your robot.
				axios.get("http://" + ip + "/api/alpha/camera", {
					params: {
						Base64: null,
						FileName: fileName,
						Width: 1200,
						Height: 1600,
						DisplayOnScreen: false,
						OverwriteExisting: true
					}
				})
				    // Use a then() method to log the response, as well as a message indicating the image has been saved with the specified file name.
					.then(function (res) {
						console.log(res);
						console.log("Image saved with fileName: '" + fileName + "'");
					});
				// Call openCallback to start the process over again
				openCallback();
			}
			catch (err) {
				console.log(err);
			}
		}

		socket.Connect();
	</script>
</body>
</html>
```