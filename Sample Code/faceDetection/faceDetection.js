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
faceDetection

This sample shows how to code Misty to react when she detects a face in
her field of view.

In this sample, we use the misty.RegisterEvent() method from Misty's
JavaScript API to register for face recognition (FaceRecognition) event
messages. Data from FaceRecognition event messages gets passed into a
callback function where we write the code that defines how the robot
should respond. In this case, Misty responds by raising her arms,
showing her happy eyes, and changing the color of her chest LED.

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!
**********************************************************************/

// This block sets Misty's arms and head to a neutral position, and
// prints a debug message that the movement is underway.
misty.Debug("Moving arms and head to neutral position");
_timeoutToNormal();

// Starts Misty's face detection process, so we can register for
// (and receive) FaceRecognition event messages.
misty.StartFaceDetection();

// Sets up our FaceRecognition event listener.
function registerFaceDetection() {
    // Creates a property test for FaceDetect event messages to check
    // whether the message has a "Label" value before passing
    // the event message into the callback. This check prevents
    // the callback from triggering on messages unrelated to face
    // detection events. (For example, the system sends a single
    // message when you successfully register for FaceRecognition
    // events, and this property test prevents that message from
    // triggering our _FaceDetect() callback function).
    misty.AddPropertyTest("FaceDetect", "Label", "exists", "", "string");
    // Registers a new event listener for FaceRecognition events. (We
    // call this event listener FaceDetect, but you can use any name
    // you like. Giving event listeners a custom name means you can
    // create multiple event listeners for the same type of event in a
    // single skill.) Our FaceDetect event listener has a debounce of
    // 1000 ms, and we set the fourth argument (keepAlive) to true,
    // which tells the system to keep listening for FaceDetect events
    // after the first message comes back.
    misty.RegisterEvent("FaceDetect", "FaceRecognition", 1000, true);
}

/*
Note: By default, when the system sends an event message, our skill
passes that message into a callback function with the same name as our
registered event listener, prefixed with an underscore. (In this case,
that's "_FaceDetect()"). You can customize the name of this callback
method by passing in a different name as an optional argument when you
call the misty.RegisterEvent() method.
*/

// Defines how Misty should respond to FaceDetect event messages. Data
// from each FaceDetect event is passed into this callback function.
function _FaceDetect(data) {
    // Prints a debug message with FaceDetect event data
    misty.Debug(JSON.stringify(data));
    misty.ChangeLED(148, 0, 211); // Changes LED to purple
    misty.DisplayImage("e_Joy.jpg"); // Displays happy eyes
    misty.MoveArmDegrees("both", -80, 100); // Raises both arms

    // Registers for a timer event to invoke the _timeoutToNormal
    // callback function after 5000 milliseconds.
    misty.RegisterTimerEvent("timeoutToNormal", 5000, false);
}

registerFaceDetection();

// Sets Misty's arms, head, LED, and display image to a neutral
// configuration.
function _timeoutToNormal() {
    misty.Pause(100);
    misty.MoveHeadDegrees(0, 0, 0, 40); // Faces head forward
    misty.MoveArmDegrees("both", 70, 100); // Lowers arms
    misty.ChangeLED(0, 255, 0); // Changes LED to green
    misty.DisplayImage("e_DefaultContent.jpg"); // Show default eyes
}