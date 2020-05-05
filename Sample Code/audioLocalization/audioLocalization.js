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
audioLocalization

This sample shows how to code Misty to localize audio. When this code
runs, Misty starts sending audio localization event messages, and
prints the degree of any arrival speech as a debug message.

In this sample, we use two methods from Misty's JavaScript API to
register for audio localization (SourceTrackDataMessage) events. We use
the misty.RegisterEvent() method to create a new event listener for
messages from Misty's audio localization system, and we use the
misty.AddReturnProperty() method to tell the system which
SourceTrackDataMessage property values those event messages should
include.

When Misty sends an audio localization event message, that message
data gets passed into a callback function where we write the code
that defines how the robot should respond.

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!

Tip: This sample prints the degree of arrival speech as a debug
message. You can extend this sample by adding code to find Misty's
current heading (yaw value from IMU), and to calculate a new heading
for Misty, so that she can turn to face the person she hears speaking.

Note: For audio localization events, the direction Misty's head is
facing is her 0/360 degrees. The system calculates the degree of
arrival speech relative to this position. We start this sample by
positioning Misty's head to face the same direction as her body,
but keep in mind that this won't always be the case.
**********************************************************************/

// Sets up Misty to start listening for audio.
misty.MoveHeadDegrees(-15, 0, 0, 50);
registerAudioLocalization();

// Misty must be recording audio to stream audio localization data.
// When this sample starts, Misty starts recording audio to a new file
// called "deleteThis.wav"
misty.StartRecordingAudio("deleteThis.wav");
misty.ChangeLED(0, 0, 255); // Changes LED to blue; "I'm listening!"
// Stops recording after 10 seconds. Extend this duration to keep Misty
// listening longer.
misty.Pause(10000);
misty.StopRecordingAudio();
misty.ChangeLED(0, 255, 0); // Changes LED to green; "Done listening!"

// Sets up our SourceTrackDataMessage event listener.
function registerAudioLocalization() {
    // Tells the system to print the value of the DegreeOfArrivalSpeech
    // property in the AdditionalResults array that comes back with
    // "DegreeOfArrivalSpeech" events. This value indicates the angle
    // relative to the direction Misty's head is facing where she
    // detected the loudest voice.
    misty.AddReturnProperty("soundIn", "DegreeOfArrivalSpeech");
    // Registers a new event listener for SourceTrackDataMessage events.
    // (We call this event listener soundIn, but you can use any name
    // you like. Giving event listeners a custom name means you can
    // create multiple event listeners for the same type of event in a
    // single skill.) Our soundIn event listener has a debounce
    // of 100 ms, and we set the fourth argument (keepAlive) to true,
    // which tells the system to keep listening for
    // SourceTarckDataMessage events after the first message comes back
    misty.RegisterEvent("soundIn", "SourceTrackDataMessage", 100, true);
}

// Defines how Misty should respond to soundIn events. Data from each
// soundIn event is passed into this callback function.
function _soundIn(data) {
    // Prints the degree of arrival speech as a debug message.
    misty.Debug(data.AdditionalResults[0].toString() + " <- degree of arrival for detected audio");
}
