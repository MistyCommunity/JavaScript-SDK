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

// TimeOfFlight callback
function _BackTOF(data) {
    // Signal that new skill has been triggered
    misty.Debug("TriggerSkill part 3 has been triggered.");
    // Store the distance of the detected object
    let distance = data.PropertyTestResults[1].PropertyParent.DistanceInMeters;
    // Check the value of distance
    if (distance < 0.1) {
        // Play irritated audio clip
        misty.PlayAudio("s_Anger.wav", 100);
        misty.Debug("An object was detected " + distance + " meters behind me. That's too close!");
        // Drive forward
        misty.DriveTime(50, 0, 1000);
    }
    else {
        // Play happy audio clip
        misty.PlayAudio("s_Joy.wav", 100);
        misty.Debug("An object was detected " + distance + " meters behind me. That's okay.");
    }
}