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
propertyTest

This sample shows how to code Misty to apply a property test to event
listeners, so that Misty ignores messages from an event that do not
meet the requirements you define in your code.

You can use property tests any time you register a new event listener.
In this sample, we filter messages from Misty's time-of-flight sensors,
so that our event callback only triggers when the front-center sensor
detects an obstacle closer than 15 cm. This event listener ignores
messages that come from the other time-of-flight sensors, and it
doesn't pass along data from the front center sensor unless its
distance reading is less than or equal to 15 cm.

To test this code, start the skill without any obstacles in front of
Misty's front center time-of-flight sensor. Then, slowly bring your
hand closer to the front of Misty's base. When the front center sensor
detects that your hand is closer than 0.15 cm, Misty's LED should
change to red.

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!
**********************************************************************/

// Creates a property test for FrontTOF event messages to check
// whether the value of the SensorPosition property is equal to
// "Center". The FrontTOF listener ignores any TimeOfFlight messages
// where this is not the case.

misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string");

/*
Note: All possible time-of-flight sensor positions are:
* Center
* Left
* Right
* Back
* DownFrontRight
* DownFrontLeft
* DownBackRight
* DownBackLeft
*/

// Creates a property test for FrontTOF event messages to check
// whether the value of the DistanceInMeters property is less than or
// equal to 0.15. The FrontTOF listener ignores any TimeOfFlight
// messages where this is not the case.
misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.15, "double"); 

// Registers a new event listener for TimeOfFlight events. (We call
// this event listener FrontTOF, but you can use any name you like.)
// Our FrontTOF event listener has a debounce of 0 ms, and we set the
// fourth argument (keepAlive) to false, which tells the system to stop
// listening for FrontTOF events after the first message comes back.
misty.RegisterEvent("FrontTOF", "TimeOfFlight", 0, false);

// Changes LED to purple
misty.ChangeLED(144, 0, 230);

// Defines how Misty should respond to FrontTOF events. Remember, this
// callback function ONLY triggers when Misty detects on obstacle
// closer than 0.15 cm with her front center sensor.
function _FrontTOF(data) {
    // Prints the value of the DistanceInMeters property from our front
    // center time-of-flight sensor. Event messages that pass a
    // property test are pushed to the PropertyTestResults array in the
    // data that gets passed into our event callback.
    misty.Debug(data.PropertyTestResults[0].PropertyParent.DistanceInMeters);
    misty.ChangeLED(255, 0, 0); // Changes LED to red
    misty.PlayAudio("s_Amazement.wav"); // Plays an amazed sound
}