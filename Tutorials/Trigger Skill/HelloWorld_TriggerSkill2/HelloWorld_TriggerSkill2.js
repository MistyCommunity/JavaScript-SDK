/*
*    Copyright 2018 Misty Robotics, Inc.
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

// callback for face recognition event
function _FaceRecognition(data) {
    // Signal that new skill has been triggered.
    misty.Debug("TriggerSkill part 2 has been triggered.");
    // Store the name of the detected face
    let personName = data.AdditionalResults[0];
    if (personName == "unknown person") {
        // Change LED
        misty.ChangeLED(255, 0, 0); // red
        misty.Debug("I don't know you...");
    }
    else {
        // Change LED
        misty.ChangeLED(0, 255, 0); // green
        misty.Debug("Hello there " + personName + "!");
    }
}