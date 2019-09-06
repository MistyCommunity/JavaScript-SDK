/**********************************************************************
Copyright 2019 Misty Robotics, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
imitations under the License.
**********************************************************************/

/**********************************************************************
bumpSensor

This sample shows how to code Misty to play different sounds when you
trigger the bump sensors on her base.

In this sample, we use two methods from Misty's JavaScript API to
register for bump sensor (BumpSensor) event messages. We use the
misty.RegisterEvent() method to create a new event listener for
messages from Misty's bump sensors, and we use the
misty.AddReturnProperty() method to tell the system which
BumpSensor property values those event messages should include.

When Misty sends a BumpSensor event message, that message data gets
passed into a callback function where we write the code that defines
how the robot should respond.

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!
**********************************************************************/

// Tells the system to print the value of the sensorName property
// in the AdditionalResults array that comes back with "Bumped"
// event messages. This value tells us which sensor a Bumped event
// message is associated with.
misty.AddReturnProperty("Bumped", "sensorName");

// Tells the system to print the value of the isContacted property
// in the AdditionalResults array that comes back with "Bumped"
// event messages. This value is true when a sensor is pressed, and
// false when a sensor is released.
misty.AddReturnProperty("Bumped", "IsContacted");

// Registers a new event listener for BumpSensor events. (We call this
// event listener Bumped, but you can use any name you like. Giving
// event listeners a custom name means you can create multiple event
// listeners for the same type of event in a single skill.) Our Bumped
// event listener has a debounce of 50 ms, and we set the fourth
// argument (keepAlive) to true, which tells the system to keep
// listening for Bumped events after the first message comes back.
misty.RegisterEvent("Bumped", "BumpSensor", 50 ,true);

/*
Note: By default, when the system sends an event message, our skill
passes that message into a callback function with the same name as our
registered event listener, prefixed with an underscore. (In this case,
that's "_Bumped()"). You can customize the name of this callback method
by passing in a different name as an optional argument when you call
the misty.RegisterEvent() method.
*/

// Defines how Misty should respond to Bumped event messages. The
// data from each Bumped event is passed into this callback function.
function _Bumped(data) {
    // Assigns the values of sensorPosition and isPressed (the first
    // and second elements in our AdditionalResults array) to variables
    var sensor = data.AdditionalResults[0];
    var isPressed = data.AdditionalResults[1];

    // If isPressed is true, prints a debug message telling us which
    // sensor was touched. If isPressed is false, prints a debug
    // message telling us which sensor was released.
    isPressed ? misty.Debug(sensor+" is Pressed") : misty.Debug(sensor+" is Released");

    // If isPressed is true, plays a different sound depending which
    // sensor is touched.
    if (isPressed) {
        if (sensor == "Bump_FrontRight") {
            misty.PlayAudio("s_Joy2.wav");
        }
        else if (sensor == "Bump_FrontLeft") {
            misty.PlayAudio("s_Awe3.wav");
        }
        else if (sensor == "Bump_RearLeft") {
            misty.PlayAudio("s_PhraseHello.wav");
        }
        else if (sensor == "Bump_RearRight") {
            misty.PlayAudio("s_Fear.wav");
        }
        else {
            misty.Debug("Sensor Name Unknown");
        }
    }
};

/*
Tip: Misty can react to events in a variety of ways. To make the
reactions in this sample more expressive, add code to the conditional
blocks that run inside in the _Bumped() callback function. As a basic
example, you can change the image on Misty's display to her happy eyes
by calling misty.DisplayImage("e_Joy.jpg"), or change the color of her
chest LED to red by calling misty.ChangeLED(255, 255, 255)
*/