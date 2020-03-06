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