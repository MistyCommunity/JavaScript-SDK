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
faceRecognition

This sample shows how to code Misty to recognize faces she detects in
her field of view. She reacts differently when she detects a known
face vs. when she detects an unknown face.

In this sample, we use the misty.RegisterEvent() method from Misty's
JavaScript API to register for face recognition (FaceRecognition) event
messages. Data from FaceRecognition event messages gets passed into a
callback function where we write the code that defines how the robot
should respond.

In this case, when Misty sees an unknown person, she raises her arms,
changes her LED to red, and raises an eyebrow. When she sees you, she
changes her LED to purple, raises her arms, and shows her happy eyes.

Note: Before you run this code, you'll need to train Misty to recognize
your face. Then, replace the "<Your-Name>" string in the _FaceRec()
callback function with the name Misty associates with your face. You
can train Misty to recognize your face by using the Command Center.
For more information, see Face Training & Recognition section of the
Command Center documentation:

https://docs.mistyrobotics.com/tools-&-apps/web-based-tools/command-center/#face-training-amp-recognition

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!
**********************************************************************/

// This block sets Misty's arms and head to a neutral position, and
// prints a debug message that the movement is underway.
misty.Debug("Moving arms and head to neutral position");
_timeoutToNormal();

// Starts Misty's face recognition process, so we can register for (and
// receive) FaceRecognition event messages.
misty.StartFaceRecognition();

// Sets up our FaceRecognition event listener.
function registerFaceRec() {
    // Creates a property test for FaceRec event messages to check
    // whether the message has a "PersonName" value before passing
    // the event message into the callback. This check prevents
    // the callback from triggering on messages unrelated to face
    // detection events. (For example, the system sends a single
    // message when you successfully register for FaceRecognition
    // events, and this property test prevents that message from
    // triggering our _FaceRec() callback function).
    misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
    // Registers a new event listener for FaceRecognition events. (We
    // call this event listener FaceRec, but you can use any name you
    // like. Giving event listeners a custom name means you can create
    // multiple event listeners for the same type of event in a single
    // skill.) Our FaceRec event listener has a debounce of 1000 ms,
    // and we set the fourth argument (keepAlive) to true, which tells
    // the system to keep listening for FaceRec events after the first
    // message comes back.
    misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, true);
}

/*
Note: By default, when the system sends an event message, our skill
passes that message into a callback function with the same name as our
registered event listener, prefixed with an underscore. (In this case,
that's "_FaceRec()"). You can customize the name of this callback
method by passing in a different name as an optional argument when you
call the misty.RegisterEvent() method.
*/

// Defines how Misty should respond to FaceRec event messages. Data
// from each FaceRec event is passed into this callback function.
function _FaceRec(data) {
    // Gets the value of the PersonName property in the FaceRecognition
    // event message. Because we used a property test to check for the
    // PersonName property, the value of this property is added to the
    // PropertyValue object in the first element of the
    // PropertyTestResults array that comes back with our callback data
    var faceDetected = data.PropertyTestResults[0].PropertyValue;

    // Tells Misty how to react if the face is unknown.
    if (faceDetected == "unknown person") {
        misty.ChangeLED(255, 0, 0); // Changes LED to red
        misty.DisplayImage("e_Disgust.jpg"); // Raises eyebrows
        misty.MoveArmDegrees("both", 70, 10); // Raises both arms
    }
    // Tells Misty how to react when she sees you. Replace
    // "<Your-Name>" below with the label you have trained Misty to
    // associate with your face.
    else if (faceDetected == "Johnathan") {
        misty.ChangeLED(148, 0, 211); // Changes LED to purple
        misty.DisplayImage("e_Joy.jpg"); // Shows happy eyes
        misty.MoveArmDegrees("both", -80, 10); // Raises both arms
    }

    // Registers for a timer event to invoke the _timeoutToNormal
    // callback function after 5000 milliseconds.
    misty.RegisterTimerEvent("timeoutToNormal", 5000, false);
}

registerFaceRec();

// Sets Misty's arms, head, LED, and display image to a neutral
// configuration.
function _timeoutToNormal() {
    misty.Pause(100);
    misty.MoveHeadPosition(0.1, 0.1, 0.1, 40); // Faces head forward
    misty.MoveArmDegrees("both", 70, 10); // Lowers arms
    misty.ChangeLED(0, 255, 0); // Changes LED to green
    misty.DisplayImage("e_DefaultContent.jpg"); // Show default eyes
}