## Tutorial 3: Exploring Computer Vision

Read this tutorial in the documentation at [docs.mistyrobotics.com](https://docs.mistyrobotics.com/onboarding/creating-skills/writing-skill/#tutorial-3-exploring-computer-vision)

This tutorial teaches how to write a skill to have Misty detect, recognize, and learn faces. When this skill runs, Misty checks a given name against her list of known faces. If the name exists, she engages facial recognition to see the user in her field of vision and print a message to the console, greeting the user by name. If the name does not match a known face, Misty uses facial training to learn the user’s face, assigns it the name provided, and prints a greeting to the console. This tutorial teaches:
* How to use REST API commands for facial training and recognition
* How to subscribe to and use data from Misty’s `ComputerVision` WebSocket connection

Before you write any code, connect Misty to your home network and make sure you know her IP address. You can see how to get this information in the first tutorial above.

### Setting Up Your Project

This project uses the Axios library and the `lightSocket.js` helper tool to handle requests and simplify the process of subscribing to Misty’s WebSocket connections. You can read more about these tools in the first and second tutorials above. 

To set up your project, create a new .html document. Give it a title, and include references to `lightSocket.js` and a content delivery network (CDN) for the Axios library in the `<head>` section. Place the code for commanding Misty within `<script>` tags in the `<body>` section of this document.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Remote Command Tutorial 3</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- Include references to a CDN for the Axios library and the local path where lightSocket.js is saved in the <head> of your document -->
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>  
        <script src="<local-path-to-lightSocket.js>"></script>
    </head>
    <body>
        <script>
            // Write the code for the program here!
        </script>
    </body>
</html>
    
```

### Writing the Code

Within `<script>` tags in the `<body>` of your document, declare a constant variable `ip` and set its value to a string with your robot’s IP address. We use this variable to send commands to Misty.

```JavaScript

/* GLOBALS */

// Declare a constant variable and set its value to a string with your robot's IP address.
const ip = "<robotipaddress>"

```

Create a global constant called `you` and assign it to a string with your name. Initialize an additional global variable called `onList` with the value `false`. We use these variables to check and indicate whether the user (`you`) is found on Misty’s list of learned faces.

```JavaScript

/* GLOBALS */

const ip = "<robotipaddress>"

// Create a global constant called `you` and assign it to a string with your name. Initialize an additional global variable called `onList` with the value `false`. We use these variables to check and indicate whether the user (you) is found on Misty’s list of learned faces.
const you = "<your-name>"
let onList = false;
```

**Note:** Avoid hard-coding name values like this in real-world applications of Misty skills. Instead, create a form in the browser where users can type and send their names to Misty.

#### Opening a Connection

Beneath these global variable declarations, declare a new instance of  `LightSocket` called `socket`. This instance of `LightSocket` takes as parameters your robot’s IP address and callback functions that trigger when the connection opens or closes. Pass `ip` as the first argument, and specify a parameter for the open callback function named `openCallback()`.  Below this declaration, declare the `openCallback()` function with the prefix `async` to indicate it is an asynchronous function.

```JavaScript

// Create a new instance of LightSocket called socket. Pass as arguments the ip variable and a function named openCallback.
let socket = new LightSocket(ip, openCallback);

/* CALLBACKS */

// Define the function passed as the callback to the new instance of LightSocket. This is the code that executes when socket opens a connection to your robot.
async function openCallback() {

}

```

A subscription to the `ComputerVision` WebSocket may already be active if the skill has run multiple times in quick succession, or if the program crashed before reaching completion. To handle this, pass `"ComputerVision"` to `socket.Unsubscribe()` at the beginning of the `openCallback()` function. This unsubscribes from any existing `ComputerVision` WebSocket connections to avoid issues caused by multiple attempts to subscribe to the same event.

```JavaScript

async function openCallback() {
    // Unsubscribe from any existing ComputerVision WebSocket connections.
    socket.Unsubscribe("ComputerVision");
}

```

Next, the program should pause to give Misty time to register and execute the command. Do this by defining a helper function called `sleep()`.  The `sleep()` function creates and returns a promise that resolves when `setTimeout()` expires after a designated number of milliseconds. Declare this function at the top of your script so other parts of the program can access it. Inside the `openCallback()` function, call the `sleep()` function and pass in a value of `3000`. Prefix `sleep()` with `await` to indicate that `openCallback()` should pause execution of the event loop until the promise has been resolved.

```JavaScript

/* TIMEOUT */

// Define a helper function called sleep that can pause code execution for a set period of time.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* CALLBACKS */

async function openCallback() {
    socket.Unsubscribe("ComputerVision");
    // Use sleep() to pause execution for three seconds to give Misty time to register and execute the command.
    await sleep(3000);
}

```

Next, check if the name stored in `you` is included on the list of faces Misty already knows. Inside `openCallback()`, use Axios to issue a GET request to the endpoint for the [`GetLearnedFaces`](https://docs.mistyrobotics.com/apis/api-reference/rest/#getlearnedfaces-beta) command: `"http://" + ip + "/api/beta/faces".`

```JavaScript
async function openCallback() {
    socket.Unsubscribe("ComputerVision");
    await sleep(3000);

    // Issue a GET request to the endpoint for the GetLearnedFaces command. 
    axios.get("http://" + ip + "/api/beta/faces")
}
```

This request returns a list of the names of faces Misty has already been trained to recognize. We pass a callback function to a `then()` method to parse the response to the `GetLearnedFaces` request, and check whether the name stored in `you` exists in Misty’s list of known faces. Start by storing the list returned by the response in a variable called `faceArr`. Print `faceArr` to the console.

```JavaScript
async function openCallback() {
    socket.Unsubscribe("ComputerVision");
    await sleep(3000);

    // Use then() to pass the response to a callback function.
    axios.get("http://" + ip + "/api/beta/faces").then(function (res) {
        // Store the list of known faces in the faceArr variable and print the list to the console.
        let faceArr = res.data[0].result;
        console.log("Learned faces:", faceArr);
    });
}
```

The next step is to loop through the `faceArr` array and compare the name of each learned face to the value of `you`. If a match is found, we update the value of the global `onList` variable to `true`. Create a `for` loop to check each item in `faceArr` against `you`. Inside this loop, use an `if` statement to update the value of the `onList` variable to `true` if a match is found.

```JavaScript
async function openCallback() {
    socket.Unsubscribe("ComputerVision");
    await sleep(3000);

    axios.get("http://" + ip + "/api/beta/faces").then(function (res) {
        let faceArr = res.data[0].result;
        console.log("Learned faces:", faceArr);

        // Loop through each item in faceArr. Compare each item to the value stored in the you variable.
        for (let i = 0; i < faceArr.length; i++) {
            // If a match is found, update the value of onList to true.
            if (faceArr[i] === you) {
                onList = true;
            }
        }
    });
}
```

At this point the program takes one of two paths. If `onList` becomes `true`, Misty should start facial recognition to identify the user in her field of vision and greet them by name. Otherwise, Misty should start facial training, so she can learn the user’s face and recognize them in the future. Set aside a section of the script for `/* COMMANDS */` and declare two new functions, `startFaceRecognition()` and `startFaceTraining()`, for each of these paths. Use the prefix `async` when you declare the `startFaceTraining()` function to indicate the function is asynchronous.

```JavaScript
/* COMMANDS */

// Define the function that executes if the value stored in you is on Misty's list of known faces. 
function startFaceRecognition() {

};

// Define the function that executes to learn the user's face if the value stored in you is not on Misty's list of known faces.
async function startFaceTraining() {

};
```

In either case, we need to subscribe to the [`ComputerVision`](https://docs.mistyrobotics.com/onboarding/creating-skills/writing-skill/#computervision-beta-) WebSocket to receive facial data from Misty. In the `openCallback()` function, after the `for` loop has checked through the list of returned faces, call `socket.Subscribe()`. As described in the second tutorial above, `socket.Subscribe()` accepts eight parameters. Pass `"ComputerVision"` for the `eventName` and `msgType` parameters. Set `debounceMs` to `200`, and pass a callback function named `_ComputerVision()` for the `callback` parameter. There is no need to define event conditions for this data stream; pass `null` for all other arguments.

```JavaScript
async function openCallback() {
    socket.Unsubscribe("ComputerVision");
    await sleep(3000);

    axios.get("http://" + ip + "/api/beta/faces").then(function (res) {
        let faceArr = res.data[0].result;
        console.log("Learned faces:", faceArr);

        for (let i = 0; i < faceArr.length; i++) {
            if (faceArr[i] === you) {
                onList = true;
            }
        }

        // Subscribe to the ComputerVision WebSocket. Pass "ComputerVision" for the eventName and msgType parameters. Set debounceMs to 200, and pass a callback function named _ComputerVision for the callback parameter. There is no need to define event conditions for this data stream; pass null for all other arguments.
        socket.Subscribe("ComputerVision", "ComputerVision", 200, null, null, null, null, _ComputerVision);

    });
}
```

After subscribing to `ComputerVision`, write an `if...else` statement to execute `startFaceRecognition()` if `onList` is `true`, and to execute `startFaceTraining()` if `onList` is `false`. In each condition, print a message to the console to state whether the program found the user on the list.

```JavaScript
async function openCallback() {
    socket.Unsubscribe("ComputerVision");
    await sleep(3000);

    axios.get("http://" + ip + "/api/beta/faces").then(function (res) {
        let faceArr = res.data[0].result;
        console.log("Learned faces:", faceArr);

        for (let i = 0; i < faceArr.length; i++) {
            if (faceArr[i] === you) {
                onList = true;
            }
        }

        socket.Subscribe("ComputerVision", "ComputerVision", 200, null, null, null, null, _ComputerVision);

        // Use an if...else statement to execute startFaceRecognition() if onList is true, and to execute startFaceTraining if onList is false.
        if (onList) {
            console.log("You were found on the list!");
            startFaceRecognition();
        } else {
            console.log("You're not on the list...");
            startFaceTraining();
        }

    });
}
```

#### Commands

Within the `startFaceRecognition()` function, print a message to the console that Misty is “starting face recognition”. Then, use Axios to send a POST request to the endpoint for the `StartFaceRecognition` command: `"http://" + ip + "/api/beta/faces/recognition/start"`. There is no need to send data along with this request, so you can omit the second parameter of `axios.post()`. 

This command tells Misty to start the occipital camera so she can match the face in her field of vision with a name on her list of known faces. Because this is a `ComputerVision` event, the callback for the `ComputerVision` WebSocket triggers as this data comes in. If the face is recognized, the name of the recognized person is included in the WebSocket data message. Instructions for handling these messages are included in the **Callbacks** section of this tutorial.

```JavaScript
function startFaceRecognition() {
    // Print a message to the console that Misty is “starting face recognition”. Then, use Axios to send a POST request to the endpoint for the StartFaceRecognition command.
    console.log("starting face recognition");   
    axios.post("http://" + ip + "/api/beta/faces/recognition/start");
};
```

In `startFaceTraining()`, log a message to the console that Misty is “starting face training”. Then use Axios to send a POST request to the endpoint for the `StartFaceTraining` command: `"http://" + ip + "api/beta/faces/training/start"`. This command tells Misty to use her occipital camera to learn the user’s face and pair it with a `FaceID` so she can recognize it in the future. Send a data object along with the request that includes the key `FaceId` with the value `you` to attach the name stored in `you` to the learned face.  

```JavaScript
async function startFaceTraining() {
    // Print a message to the console that Misty is “starting face training”. Then use Axios to send a POST request to the endpoint for the StartFaceTraining command.
    console.log("starting face training");
    axios.post("http://" + ip + "/api/beta/faces/training/start", { FaceId: you });
};
```

To give Misty time to learn the user’s face, use the helper function `sleep()` to pause execution of the program. Below the POST command, call `sleep()` and pass in the value `20000` for 20 seconds. This gives Misty plenty of time to finish the facial training process. Prefix `sleep()` with the keyword `await`. 

```JavaScript
async function startFaceTraining() {
    console.log("starting face training");
    axios.post("http://" + ip + "/api/beta/faces/training/start", { FaceId: you });
    // Give Misty time to complete the face training process. Call sleep and pass in the value 20000 for 20 seconds. 
    await sleep(20000);
    // Print a message to the console that face training is complete.
    console.log("face training complete");

};
```

When Misty is done learning the face, we want her to try to recognize it. Below `sleep()`, log a message to the console that face training is complete. Then, use Axios to send a POST request to the endpoint for the `StartFaceRecognition` command.

```JavaScript
async function startFaceTraining() {
    console.log("starting face training");
    axios.post("http://" + ip + "/api/beta/faces/training/start", { FaceId: you });

    await sleep(20000);
    console.log("face training complete");
    // Use Axios to send a POST request to the endpoint for the StartFaceRecognition command.
    axios.post("http://" + ip + "/api/beta/faces/recognition/start");
};
```

#### Callbacks

Data sent through the `ComputerVision` event subscription is passed to the `_ComputerVision()` callback function. As discussed in previous tutorials, WebSocket connections sometimes send registration and error messages that do not contain event data. To handle messages unrelated to `ComputerVision` events, wrap the code for the `_ComputerVision()` callback inside `try` and `catch` statements. As seen in the example, you can print caught errors to the console by passing `e` to the `catch` statement, but this is not necessary for the program to execute successfully.

```JavaScript
// Define the callback function that is passed when we subscribe to ComputerVision events.
function _ComputerVision(data) { 
    //  Wrap the code for the _ComputerVision callback inside try and catch statements to handle messages unrelated to ComputerVision events. 
    try { 

    }
    // Print caught errors to the console by passing e to the catch statement.
    catch (e) {
        console.log("Error: " + e);
    }
}
```

The `_ComputerVision()` callback triggers any time the occipital camera gathers relevant data. Messages come in regardless of whether Misty recognizes a face she detects. The message returned by the `ComputerVision` WebSocket includes a `"personName"` property. If a detected face cannot be recognized, the value of `"personName"` is `"unknown person"`. If a message does not hold any face data, then `"personName"` doesn’t exist or is `undefined`. In the `_ComputerVision()` callback function, use an `if` statement to check that `"personName"` does not equal any of these values.

```JavaScript
function _ComputerVision(data) {
    try { 
        // Use an if statement to check that personName does not equal "unknown person", null, or undefined. personName is included in the message returned by ComputerVision WebSocket events.
        if (data.message.personName !== "unknown person" && data.message.personName !== null && data.message.personName !== undefined) {

        }
    }
    catch (e) {
        console.log("Error: " + e);
    }
}
```

**Note:** This program does not handle the case where the value of `you` is on the list of known faces, but does not match the face of the person in Misty’s field of vision. This tutorial is designed to introduce the basics of face commands and `ComputerVision` events, and does not address how to handle issues such as the above. This kind of edge case could be handled in a number of ways. For example, you could have Misty print a message that the face does not match the value stored in `you`, and then command her to learn the new face and assign it a numeric value for `FaceID`. Alternately, you could have Misty start face training and include a form in your .html document to allow the user to pass a new value for `FaceID`. The decision is yours!

If a face is recognized, the value of the `"personName"` property is the name of the recognized person. In our case, this should also be the string stored in `you`. Inside the `if` statement, write code to print a message to greet the recognized face, unsubscribe from `"ComputerVision"`, and issue a POST request to the endpoint for the command to `StopFacialRecognition`: `"http://" + ip + "/api/beta/faces/recognition/stop"`.

```JavaScript
function _ComputerVision(data) {
    try {
        if (data.message.personName !== "unknown person" && data.message.personName !== null && data.message.personName !== undefined) {
            // If the face is recognized, print a message to greet the person by name.
            console.log(`A face was recognized. Hello there ${data.message.personName}!`);

            // Unsubscribe from the ComputerVision WebSocket.
            socket.Unsubscribe("ComputerVision");
            // Use Axios to issue a POST command to the endpoint for the StopFaceRecognition command.
            axios.post("http://" + ip + "/api/beta/faces/recognition/stop");
        }
    }
    catch (e) {
        console.log("Error: " + e);
    }
}
```

### Putting It All Together

At the bottom of the script, call `socket.Connect()`. When the connection is established, the `openCallback()` function executes and the process begins. 

```JavaScript
// Open the connection to your robot. When the connection is established, the openCallback function executes to check whether the value stored in you is on Misty's list of known faces. Then, the program subscribes to the ComputerVision WebSocket, and Misty either greets you by name or starts facial training to learn your face so she can greet you in the future.
socket.Connect();
```

**Congratulations!** You have written another remote skill for Misty. When the document loads, the program:
* Connects with Misty.
* Sends a `GetLearnedFaces` command and checks whether your name is on the list of faces Misty already knows.
* Subscribes to the `ComputerVision` WebSocket to receive messages when Misty is commanded to `StartFaceRecognition`. 
* Recognizes and greets you if you are on the list of known faces, or sends a `StartFaceTraining` command to learn your face if you are not.

### Full Sample

See the full .html document for reference.

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>Remote Command Tutorial 3</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Include references to a CDN for the Axios library and the local path where lightSocket.js is saved in the <head> of your document -->
	<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
	<script src="<local-path-to-lightSocket.js>"></script>
</head>
<body>
	<script>
        /* GLOBALS */
        
        // Declare a constant variable and set its value to a string with your robot's IP address.
        const ip = "<robotipaddress>"
        // Create a global constant called `you` and assign it to a string with your name. Initialize an additional global variable called `onList` with the value `false`. We use these variables to check and indicate whether the user (you) is found on Misty’s list of learned faces.
		const you = "<your-name>"
        let onList = false;
        
        // Create a new instance of LightSocket called socket. Pass as arguments the ip variable and a function named openCallback.
		let socket = new LightSocket(ip, openCallback);

        /* TIMEOUT */
        // Define a helper function called sleep that can pause code execution for a set period of time.
		function sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

        /* CALLBACKS */

        // Define the function passed as the callback to the new instance of LightSocket. This is the code that executes when socket opens a connection to your robot.
		async function openCallback() {
			// Unsubscribe from any existing ComputerVision WebSocket connections.
            socket.Unsubscribe("ComputerVision");
            // Pause execution for three seconds to give Misty time to register and execute the command.
			await sleep(3000);

			// Issue a GET request to the endpoint for the GetLearnedFaces command. Use then() to pass the response to a callback function.
			axios.get("http://" + ip + "/api/beta/faces").then(function (res) {
				// Store the list of known faces in the faceArr variable and print the list to the console.
				let faceArr = res.data[0].result;
				console.log("Learned faces:", faceArr);

				// Loop through each item in faceArr. Compare each item to the value stored in the you variable.
				for (let i = 0; i < faceArr.length; i++) {
                    // If a match is found, update the value of onList to true.
					if (faceArr[i] === you) {
						onList = true;
					}
				}

				// Subscribe to the ComputerVision WebSocket. Pass "ComputerVision" for the eventName and msgType parameters. Set debounceMs to 200, and pass a callback function named _ComputerVision for the callback parameter. There is no need to define event conditions for this data stream; pass null for all other arguments.
				socket.Subscribe("ComputerVision", "ComputerVision", 200, null, null, null, null, _ComputerVision);

				// Use an if...else statement to execute startFaceRecognition() if onList is true, and to execute startFaceTraining if onList is false.
				if (onList) {
					console.log("You were found on the list!");
					startFaceRecognition();
				} else {
					console.log("You're not on the list...");
					startFaceTraining();
				}
			});
        };
        
        // Define the callback function that is passed when we subscribe to ComputerVision events.
		function _ComputerVision(data) {
            //  Wrap the code for the _ComputerVision callback inside try and catch statements to handle messages unrelated to ComputerVision events. 
			try {
                // Use an if statement to check that personName does not equal "unknown person", null, or undefined. personName is included in the message returned by ComputerVision WebSocket events.
				if (data.message.personName !== "unknown person" && data.message.personName !== null && data.message.personName !== undefined) {
					// If the face is recognized, print a message to greet the person by name.
					console.log(`A face was recognized. Hello there ${data.message.personName}!`);

					// Unsubscribe from the ComputerVision WebSocket.
                    socket.Unsubscribe("ComputerVision");
                    // Use Axios to issue a POST command to the endpoint for the StopFaceRecognition command.
					axios.post("http://" + ip + "/api/beta/faces/recognition/stop");
				}
            }
            // Print caught errors to the console by passing e to the catch statement.
			catch (e) {
				console.log("Error: " + e);
			}
		};

        /* COMMANDS */

        // Define the function that executes if the value stored in you is on Misty's list of known faces. 
		function startFaceRecognition() {
			// Print a message to the console that Misty is “starting face recognition". Then, use Axios to send a POST request to the endpoint for the StartFaceRecognition command.
			console.log("starting face recognition");
			axios.post("http://" + ip + "/api/beta/faces/recognition/start");
        };
        
        // Define the function that executes to learn the user's face if the value stored in you is not on Misty's list of known faces.
		async function startFaceTraining() {
			// Print a message to the console that Misty is “starting face training”. Then use Axios to send a POST request to the endpoint for the StartFaceTraining command.
			console.log("starting face training");
			axios.post("http://" + ip + "/api/beta/faces/training/start", { FaceId: you });

			// Give Misty time to complete the face training process. Call sleep and pass in the value 20000 for 20 seconds. 
            await sleep(20000);
            // Print a message to the console that face training is complete. Then, use Axios to send a POST request to the endpoint for the StartFaceRecognition command.
			console.log("face training complete");
			axios.post("http://" + ip + "/api/beta/faces/recognition/start");
        };
        
        // Open the connection to your robot. When the connection is established, the openCallback function executes to check whether the value stored in you is on Misty's list of known faces. Then, the program subscribes to the ComputerVision WebSocket, and Misty either greets you by name or starts facial training to learn your face so she can greet you in the future.

        socket.Connect();
        
	</script>
</body>
</html>
```