/*
*    Copyright 2019 Misty Robotics, Inc.
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BA SIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.

*    **WARRANTY DISCLAIMER.**

*    * General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE "AS-IS" AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
*    * Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

*    Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/

*/

// debug message to indicate the skill has started
misty.Debug("starting skill HelloWorld_HeadArms");

// register for front TOF and add property tests
misty.AddPropertyTest("FrontTOF", "SensorPosition", "!==", "Back", "string");
misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.2, "double");
misty.RegisterEvent("FrontTOF", "TimeOfFlight", 100);

// front TOF callback, head
function _FrontTOF(data) {
    misty.Debug(data);
    misty.ChangeLED(0, 255, 255); // aqua
    misty.PlayAudio("s_Awe.wav");

    // pitch
    misty.MoveHeadDegrees(-40, 0, 0, 90, null, 0, 1500); // pitch up
    misty.MoveHeadDegrees(26, 0, 0, 90, null, 0, 1500); // pitch down
    misty.MoveHeadDegrees(0, 0, 0, 90, null, 0, 1500); // pitch center

    misty.ChangeLED(255, 0, 255); // magenta
    misty.PlayAudio("s_Awe2.wav");

    // yaw
    misty.MoveHeadDegrees(0, 0, -81, 90, null, 0, 1500); // yaw left
    misty.MoveHeadDegrees(0, 0, 81, 90, null, 0, 1500); // yaw right
    misty.MoveHeadDegrees(0, 0, 0, 90, null, 0, 1500); // yaw center

    misty.ChangeLED(255, 255, 0); // yellow
    misty.PlayAudio("s_Awe3.wav");

    // roll
    misty.MoveHeadDegrees(0, -40, 0, 90, null, 0, 1500); // roll left
    misty.MoveHeadDegrees(0, 40, 0, 90, null, 0, 1500); // roll right
    misty.MoveHeadDegrees(0, 0, 0, 90, null, 0, 1500); // roll center

    misty.ChangeLED(0, 0, 0); // off
    misty.PlayAudio("s_DisorientedConfused.wav");

    // register for back TOF and add property tests
    misty.AddPropertyTest("BackTOF", "SensorPosition", "==", "Back", "string");
    misty.AddPropertyTest("BackTOF", "DistanceInMeters", "<=", 0.2, "double");
    misty.RegisterEvent("BackTOF", "TimeOfFlight", 100);
}

// back TOF callback, arms
function _BackTOF() {
    misty.ChangeLED(0, 255, 0) // lime
    misty.PlayAudio("s_Joy.wav");

    // left
    misty.MoveArmDegrees("left", -29, 60, null, 0, 1500); // up
    misty.MoveArmDegrees("left", 90, 60, null, 0, 1500); // down

    misty.ChangeLED(128, 0, 0) // maroon
    misty.PlayAudio("s_Joy2.wav");

    // right
    misty.MoveArmDegrees("right", -29, 60, null, 0, 1500); // up
    misty.MoveArmDegrees("right", 90, 60, null, 0, 1500); // down

    misty.ChangeLED(0, 0, 0); // off
    misty.PlayAudio("s_Joy3.wav");

    misty.Debug("ending skill HelloWorld_HeadArms");
}