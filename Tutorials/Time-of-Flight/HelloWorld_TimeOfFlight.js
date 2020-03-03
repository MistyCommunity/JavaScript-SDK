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

// Print a message to indicate the skill has started
misty.Debug("starting skill helloworld_timeofflight");

// Issue commands to change LED and start driving
misty.ChangeLED(0, 255, 0); // green, GO!
misty.DriveTime(50, 0, 10000);

// Register for TimeOfFlight data and add property tests
misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string");
misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.2, "double");
misty.RegisterEvent("FrontTOF", "TimeOfFlight", 250);

// FrontTOF callback function
function _FrontTOF(data) {
    // Get property test results
    let frontTOF = data.PropertyTestResults[0].PropertyParent;

    // Print distance object was detected and sensor
    misty.Debug(frontTOF.DistanceInMeters);
    misty.Debug(frontTOF.SensorPosition);
    // Issue commands to change LED and stop driving
    misty.Stop();
    misty.ChangeLED(255, 0, 0); // red, STOP!
    misty.Debug("ending skill helloworld_timeofflight ");
}
