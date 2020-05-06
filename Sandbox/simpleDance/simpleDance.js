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
When this skill runs, Misty dances a simple jig. It goes like this:

* when her right arm is up, she moves her head up
* when her head is up, she moves her arm back down
* when her arm is back down, she moves her head down
* when her head is back down, she lifts her arm again
* repeat!

**********************************************************************/
misty.Debug("Running ActuatorPosition skill!");

// Set head and arms to neutral position
misty.MoveHeadDegrees(10, 0, 0, 80);
misty.MoveArmDegrees("both", 90, 100);

// Wait for position to adjust
misty.Pause(2000);

// Starts looping through synchronized head & arm movements
registerRightArm();
misty.MoveArmDegrees("right", 0, 100);

// Helper function that checks current actuator position for right arm
// and head pitch. Coordinates movement if actuator positions fall
// within a certain range. Also, un-registers and re-registers for events
// as necessary for movement coordination and to keep movement looping.
function triggerMove(actuator, data) {
    if (actuator == "ara") {
        if (data >= -3 && data <= 3) {
            misty.UnregisterEvent("ara");
            registerHeadPitch();
            misty.MoveHeadDegrees(-30, 0, 0, 100);
        } else if (data >= 87 && data <= 93) {
            misty.UnregisterEvent("ara");
            registerHeadPitch();
            misty.MoveHeadDegrees(15, 0, 0, 100);
        };
    } else if (actuator == "ahp") {
        if (data >= -33 && data <= -27) {
            misty.UnregisterEvent("ahp");
            registerRightArm();
            misty.MoveArmDegrees("right", 90, 100);
        } else if (data >= 12 && data <= 18) {
            misty.UnregisterEvent("ahp");
            registerRightArm();
            misty.MoveArmDegrees("right", 0, 100);
        };
    }
}

// Registers for data from right arm actuator (SensorID = "ara")
function registerRightArm() {
    misty.AddPropertyTest("ara", "SensorID", "==", "ara", "string");
    misty.AddReturnProperty("ara", "value");
    misty.RegisterEvent("ara", "ActuatorPosition", 100, true);
}

// Callback that handles messages from right arm actuator event listener
function _ara(data) {
    // Stores actuator position
    misty.Set("rightArmPosition", data.AdditionalResults[0]);
    // Prints debug message with current actuator value
    misty.Debug("right arm at " + misty.Get("rightArmPosition"));
    // Checks actuator value and coordinates movement
    triggerMove("ara", misty.Get("rightArmPosition"));
}

// Registers for data from head pitch actuator (SensorID = "ahp")
function registerHeadPitch() {
    misty.AddPropertyTest("ahp", "SensorID", "==", "ahp", "string");
    misty.AddReturnProperty("ahp", "value");
    misty.RegisterEvent("ahp", "ActuatorPosition", 100, true);
}

// Callback that handles messages from head pitch actuator event listener
function _ahp(data) {
    misty.Set("headPitchAngle", data.AdditionalResults[0]);
    misty.Debug("head pitch at " + misty.Get("headPitchAngle"));
    triggerMove("ahp", misty.Get("headPitchAngle"));
}