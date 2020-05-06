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

**WARRANTY DISCLAIMER.**

* General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE "AS-IS" AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
* Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/
**********************************************************************/

/**********************************************************************
hazardNotification

This sample shows how to register for hazard notification
(HazardNotification) event messages. Once you've registered for these
messages, you can use them to program Misty to back up and find another
direction when she stops driving due to an obstacle or a cliff in her
path.

In this sample, we use the misty.RegisterEvent() method from Misty's
JavaScript API to register for HazardNotification event messages. Data
from HazardNotification event messages gets passed into a callback
function where we write the code that defines how the robot should
respond. In our case, this callback function prints an array with the
names of the triggered hazards as a debug message. If the message
shows that Misty is in a hazards state, we change her LED to white,
meaning it's not safe for her to drive. If misty is NOT in a hazard
state, we change the LED to white, meaning it is safe for her to drive.

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!
**********************************************************************/

// Changes LED to white
misty.ChangeLED(255, 255, 255);

// Tells the system to print the value of the BumpSensorsHazardState
// property in the AdditionalResults array that comes back with
// "Hazard" event messages. This value tells us which hazard state
// an event message is associated with. This sample only uses data
// from the bump sensor hazard states; however, you could add
// additional return properties of HazardNotification event messages
// to programmatically respond to other types of hazard states.
misty.AddReturnProperty("Hazard", "BumpSensorsHazardState");

// Registers a new event listener for HazardNotification events. (We
// call this event listener Hazard, but you can use any name you like.
// Giving event listeners a custom name means you can create multiple
// event listeners for the same type of event in a single skill.) Our
// Hazard event listener has a debounce of 0 ms - HazardNotification
// event messages are sent whenever a hazard state changes, and do not
// use timed intervals - and we set the fourth argument (keepAlive) to
// true, which tells the system to keep listening for Hazard events
// after the first message comes back.
misty.RegisterEvent("Hazard", "HazardNotification", 0, true);

/*
Note: By default, when the system sends an event message, our skill
passes that message into a callback function with the same name as our
registered event listener, prefixed with an underscore. (In this case,
that's "_Hazard()"). You can customize the name of this callback method
by passing in a different name as an optional argument when you call
the misty.RegisterEvent() method.
*/

// Defines how Misty should respond to Hazard event messages. The
// data from each Hazard event is passed into this callback function.
function _Hazard(data) {

    var safe = false;
    
    // Prints a debug message with the contents of the
    // AdditionalResults array. Then, assigns this array to a variable.
    misty.Debug(JSON.stringify(data.AdditionalResults));
    const dataIn = data.AdditionalResults;

    // Loops through the dataIn array to check which bump sensor
    // hazards are in a hazards state, and stores the SensorNames of
    // those hazards in the triggers array.
    var triggers = [];
    dataIn.forEach(sensor => {
        sensor.forEach(sensorData => {
            sensorData.InHazard ? triggers.push(sensorData.SensorName) : {}
        });
    });
    // Checks the length of the triggers array. If not empty, prints
    // a debug message with the contents of the triggers array. If
    // empty, no bump sensors are in a hazards state, and we
    // toggle safe to be true.
    triggers.length ? misty.Debug(triggers) : safe = true;

    // If safe is true, then we change the LED to white (it's safe for
    // Misty to drive). If safe is still false, we change the LED to
    // red (it's not safe to drive).
    safe ? misty.ChangeLED(255, 255, 255) : misty.ChangeLED(255, 0, 0);
}
