/*
*    Copyright 2019 Misty Robotics, Inc.
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.

*    **WARRANTY DISCLAIMER.**

*    * General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE "AS-IS" AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
*    * Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

*    Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/

*/

misty.Debug("HelloWorld_BumpSensors is running")

// Fetch list of audio clips
misty.GetAudioList("_GetAudioList","synchronous");

// Handle the list of audio clips
function _GetAudioList(data) {
   // Assign audio files from the list to global variables
   _audio1 = data.Result[0].Name;
   _audio2 = data.Result[1].Name;
   _audio3 = data.Result[2].Name;
   _audio4 = data.Result[3].Name;

   // Return data when a bump sensor is pressed
   misty.AddPropertyTest("BumpSensor", "isContacted", "==", true, "boolean");
   // Return the sensorName property of 
   // BumpSensor events
   misty.AddReturnProperty("BumpSensor", "sensorName");
   // Register for BumpSensor events
   misty.RegisterEvent("BumpSensor", "BumpSensor", 200, true);
}

// Handle BumpSensor event data
function _BumpSensor(data) {
    // Store the name of the touched sensor
    let sensorName = data.AdditionalResults[0];

    // Play a different audio clip when
    // each sensor is prssed
    switch (sensorName) {

        case "Bump_FrontRight":
            misty.Debug("front right bump sensor pressed")
            misty.PlayAudio(_audio1, 75);
            break

        case "Bump_FrontLeft":
            misty.Debug("front left bump sensor pressed")
            misty.PlayAudio(_audio2, 75);
            break

        case "Bump_RearRight":
            misty.Debug("rear right bump sensor pressed")
            misty.PlayAudio(_audio3, 75);
            break

        case "Bump_RearLeft":
            misty.Debug("rear left bump sensor pressed")
            misty.PlayAudio(_audio4, 75);
            break
    }
}