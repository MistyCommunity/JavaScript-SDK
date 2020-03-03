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
timeOfFlights

This sample shows how to code Misty to react when she detects an object
within a certain distance of her range (outward-facing) time-of-flight
sensors. You can use this sample as a template to customize your own
reactions to time-of-flight events.

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!
**********************************************************************/

// Creates a property test for TOF event messages to check whether the
// value of the type property is "range". (This TOF listener ignores
// any messages sent by Misty's "edge" (downward-facing) sensors).
misty.AddPropertyTest("TOF", "type", "==", "Range", "string"); 

// Creates a property test for TOF event messages to check
// whether the value of the DistanceInMeters property is less than or
// equal to 0.20. The TOF listener ignores any TimeOfFlight
// messages where this is not the case.
misty.AddPropertyTest("TOF", "DistanceInMeters", "<=", 0.20, "double"); 

// Registers a new event listener for TimeOfFlight events. (We call
// this event listener TOF, but you can use any name you like.)
// Our TOF event listener has a debounce of 0 ms, and we set the
// fourth argument (keepAlive) to false, which tells the system to keep
// listening for TOF events after the first message comes back.
misty.RegisterEvent("TOF", "TimeOfFlight", 0, true);

// Changes LED to purple
misty.ChangeLED(144, 0, 230);

// Defines how Misty should respond to FrontTOF events. Remember, this
// callback function ONLY triggers when Misty detects on obstacle
// closer than 0.20 cm.
function _TOF(data) {
    // Prints the value of the DistanceInMeters property. Event
    // messages that pass a property test are pushed to the
    // PropertyTestResults array in the data that gets passed into our
    // event callback.
    misty.Debug(data.PropertyTestResults[0].PropertyParent.DistanceInMeters);
    misty.ChangeLED(235, 150, 50); // Changes LED to orange
    misty.PlayAudio("s_Amazement.wav"); // Plays an amazed sound
}