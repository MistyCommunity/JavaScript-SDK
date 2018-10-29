## Tutorial 1: Changing Misty’s LED

Read this tutorial in the documentation at [docs.mistyrobotics.com](https://docs.mistyrobotics.com/onboarding/creating-skills/writing-skill/#tutorial-1-changing-misty-s-led)

These tutorials describe how to write skills for Misty that use her REST API. With the REST API, we can send commands to Misty from an external device, like the web browser of a laptop or desktop. These tutorials show how to use .html documents and inline JavaScript to write programs for Misty that run in your web browser. In this tutorial, you learn how to write a program that sends a REST command to change the color of Misty’s chest LED.

### Connecting Misty to Your Network
Because these commands are sent to Misty over a local network connection, you must connect your robot to your local network. [Use the Companion App](https://docs.mistyrobotics.com/onboarding/3-ways-to-interact-with-misty/companion-app/#connecting-misty-to-bluetooth-and-wi-fi) to connect your robot to your Wi-Fi network, or [follow this guide](https://docs.mistyrobotics.com/onboarding/3-ways-to-interact-with-misty/api-explorer/#connecting-wifi) to connect Misty to your Wi-Fi network using the API Explorer and an Ethernet/USB dongle. Once Misty is connected to your network, take note of her IP address to use with the REST API commands.

### Setting Up Your Project
This tutorial uses Misty’s REST API to send a POST request that changes the color of her chest LED and logs a successful response. To set up your project, create a new .html document. To simplify the task of making `XMLHttpRequests` to Misty from the browser, we’ll use Axios, an HTTP library supported by most web browsers and Node.js. To use Axios in your program, reference a link to a CDN for Axios inside `<script>` tags in the `<head>` section of your .html file when you set up the project. 

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Remote Command Tutorial 1</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Reference a link to a CDN for Axios here -->
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
</head>
<body>
</body>
</html>
```

Alternately, you can download a compressed version of the Axios library to include in your project. Read more about Axios [here](https://github.com/axios/axios).

### Writing the Code
Within `<script>` tags in the `<body>` of your .html document, declare a constant variable `ip` and set its value to a string with your robot’s IP address. We’ll reference this variable throughout the program to send commands to Misty. 

```html
<body>
    <script>
        // Declare a constant variable and set its value to a string with your robot's IP address.
        const ip = "<robotipaddress>";

    </script>
</body>
```

When we send a command to change Misty’s LED color, we need to communicate what the new color should be. The REST API command to change Misty’s LED requires three parameters: `“red”`, `“green”`, and `“blue”`. These parameters represent the [RGB values](https://developer.mozilla.org/en-US/docs/Glossary/RGB) of the new color. 

Create an object called `data` to send with the POST request. Create a property for each color parameter, and set the value of each property to an integer between `0` and `255`. The RGB values in the example change Misty’s chest LED to hot pink.

```html
<body>
    <script>
        const ip = "<robotipaddress>";

        // Assemble the data to send with your POST request. Set values for each RGB color property.
        let data = {
            "red": 255,
            "green": 0,
            "blue": 255
        };

    </script>
</body>
```

Now we’re ready to write the code to send the command to Misty. We do this by using the `axios.post()` method included in the Axios library. This method accepts two parameters:
* the URL of the request, and
* the data to send with the request. 

The REST API endpoint for the `ChangeLED` command is `http://<robotipaddress>/api/led/change`. In your code, call `axios.post()` and pass a string with this endpoint as the first parameter. Use the previously defined variable `ip` to populate the `<robotipaddress>` section of the URL. Pass the `data` object for the second parameter.

```html
<body>
    <script>
        const ip = "<robotipaddress>";

        let data = {
            "red": 255,
            "green": 0,
            "blue": 255
        };

        // Call axios.post(), passing the URL of the ChangeLED endpoint as the first parameter, and the payload (the data object) as the second.
        axios.post("http://" + ip + "/api/led/change", data)

    </script>
</body>
```

Because Axios is promise based, we need to use a `then()` method after calling `post()`. This method returns a promise and triggers a callback function if the promise is fulfilled. We pass a callback function to `then()` to interpret information from the return values of the POST call and print a message to the console about whether the request was a failure or success.

```html
<body>
    <script>
        const ip = "<robotipaddress>";

        let data = {
            "red": 255,
            "green": 0,
            "blue": 255
        };

        axios.post("http://" + ip + "/api/led/change", data)
        // Use then() after calling post(). Pass a callback function to interpret the return values of the POST call and print a message to the console about whether the request was a failure or a success.
            .then(function (response) {
                console.log(`ChangeLED was a ${response.data[0].status}`);
        })

    </script>
</body>
```

We use a `catch()` method after `then()`, which triggers if the promise is rejected. Pass a callback function to `catch()` to print to the console any errors returned by the request.

```html
<body>
    <script>
        const ip = "<robotipaddress>";

        let data = {
            "red": 255,
            "green": 0,
            "blue": 255
        };

        axios.post("http://" + ip + "/api/led/change", data)
            .then(function (response) {
        console.log(`ChangeLED was a ${response.data[0].status}`)
        // Use a catch() method after then(). catch() triggers if the promise is rejected. Pass a callback to catch() to print any errors returned by the request to the console.
            .catch(function (error) {
                console.log(`There was an error with the request ${error}`);
            })
        })

    </script>
</body>
```

Now we’re ready to run the program!
1. Save your .html document.
2. Open the .html file in a web browser.
3. Open the developer tools of your web browser to view the console. 

When the page loads, it sends a `ChangeLED` command to Misty, and a message about the results of the command prints to the console. **Congratulations!** You have just written your first program using Misty’s REST API!

### Full Sample

See the full .html document for reference.