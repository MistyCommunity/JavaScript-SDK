/**********************************************************************
Copyright 2020 Misty Robotics, Inc.

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
MistySkillSelector

This sample skill uses display layers and sensor events to create an
interface that you can use to start and stop the skills on your robot.

When it runs, you can:
* touch Misty's chin to toggle the skill "menu"
* touch Misty's front left/right bump sensors to "scroll" through a list
of installed skills
* touch Misty's rear left/right bump sensor to stop/start the selected
skill

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!
**********************************************************************/


/**Setup**/

// Sets some useful keys that we can use to track the menu state
// (is the menu active? & which skill is selected?)
misty.Set("ShowMenuLayer", false);
misty.Set("ShowIconLayer", false);
misty.Set("MenuIndex", 0);

/**Events**/

// Registers listener for TouchSensor events
misty.AddReturnProperty("Touched", "sensorName");
misty.AddReturnProperty("Touched", "isContacted");
misty.RegisterEvent("Touched", "TouchSensor", 100, true);

// Registers listener for BumpSensor events
misty.AddReturnProperty("Bumped", "sensorName");
misty.AddReturnProperty("Bumped", "isContacted");
misty.RegisterEvent("Bumped", "BumpSensor", 100, true);

/**Callbacks**/

// TouchSensor event callback (shows or hides the menu).
// Add cases for other sensors to build out functionality.
function _Touched(data) {
    if (data.AdditionalResults[1] == true) {
        switch (data.AdditionalResults[0]) {
            case "CapTouch_Chin":
                toggleSkillMenu();
                break;
            default:
                return;
        }
    }
}

// BumpSensor event callback. While the menu is visible, we can:
// * Touch front left sensor to "scroll left"
// * Touch front right sensor to "scroll right"
// * Touch either rear bump sensor to start/stop the selected skill
function _Bumped(data) {
    if (data.AdditionalResults[1] == true) {
        switch (data.AdditionalResults[0]) {
            case "Bump_FrontLeft":
                misty.Set("MenuIndex", misty.Get("MenuIndex") + 1);
                displaySkillName();
                break;
            case "Bump_FrontRight":
                misty.Set("MenuIndex", misty.Get("MenuIndex") - 1);
                displaySkillName();
                break;
            case "Bump_RearRight":
                startOrStopSkill();
                break;
            case "Bump_RearLeft":
                startOrStopSkill();
                break;
            default:
                return;
        }
    }
}

// Saves data about this robot's currently installed skills
function _GetSkills(data) {
    misty.Set("InstalledSkills", JSON.stringify(data.Result));
    displaySkillName();
}

// Updates IconLayer with a "play" character, if the selected skill is
// not running, or a stop icon if it is.
function _GetRunningSkills(data) {
    for (let i = 0; i <= data.Result.length; i ++) {
        if (data.Result[i].Name == misty.Get("SelectedSkill")) {
            misty.DisplayText("■", "IconLayer")
            misty.SetTextDisplaySettings("IconLayer", false, false, true, 1, 75, 400, true, "Center", "Bottom", "Normal", 255, 0, 0, 480, 100, true, "Courier New");
            misty.Set("RunningSelectedSkill", true);
            break;
        }
        else {
            misty.DisplayText("►", "IconLayer");
            misty.SetTextDisplaySettings("IconLayer", false, false, true, 1, 75, 400, true, "Center", "Bottom", "Normal", 0, 255, 0, 480, 100, true, "Courier New");
            misty.Set("RunningSelectedSkill", false);
        }
    }
}

/**Helpers**/

// Toggles menu display
function toggleSkillMenu() {
    if (!misty.Get("ShowMenuLayer")) {
        // Update installed skills data
        misty.GetSkills();

        // Toggle display layers
        misty.SetTextDisplaySettings("MenuLayer", null, null, true);
        misty.SetTextDisplaySettings("IconLayer", null, null, true);
        misty.SetImageDisplaySettings("DefaultImageLayer", null, null, false);

        // Update menu state
        misty.Set("ShowMenuLayer", true);
        misty.Set("ShowIconLayer", true);
    }
    else if (misty.Get("ShowMenuLayer")) {
        // Toggle display layers
        misty.SetTextDisplaySettings("MenuLayer", null, null, false);
        misty.SetTextDisplaySettings("IconLayer", null, null, false);
        misty.SetImageDisplaySettings("DefaultImageLayer", null, null, true);

        // Update menu state
        misty.Set("ShowMenuLayer", false);
        misty.Set("ShowIconLayer", false);
    }
}

// Displays the name of the skill at the current MenuIndex, and updates
// MenuIndex to reflect user input. Then calls GetsRunningSkills to
// update the IconLayer with a play icon (if the skill is stopped)
// or a stop icon (if the skill is cancelled).
function displaySkillName() {
    let index = misty.Get("MenuIndex");
    let skillsArray = JSON.parse(misty.Get("InstalledSkills"));
    if (index >= skillsArray.length) {
        index = 0;
        misty.Set("MenuIndex", index);
    }
    else if (index < 0) {
        index = (skillsArray.length - 1);
        misty.Set("MenuIndex", index);
    }

    misty.Set("SelectedSkill", skillsArray[misty.Get("MenuIndex")].Name);
    misty.DisplayText(skillsArray[misty.Get("MenuIndex")].Name + "", "MenuLayer")
    // More arguments than there are stars in heaven
    misty.SetTextDisplaySettings("MenuLayer", false, false, true, 1, 40, 400, true, "Center", "Center", "Normal", 255, 255, 255, 480, 80, true, "Courier New");
    misty.PlayAudio("s_SystemSuccess.wav")
    misty.GetRunningSkills()
}

// If not RunningSelectedSkill: runs the skill. 
// If RunningSelectedSkill: stops the selected skill.
// Hides the menu regardless.
function startOrStopSkill() {
    if (misty.Get("ShowMenuLayer")) {
        toggleSkillMenu();

        let index = misty.Get("MenuIndex");
        let skillsArray = JSON.parse(misty.Get("InstalledSkills"));
        if (misty.Get("RunningSelectedSkill")) {
            misty.PlayAudio("s_PhraseByeBye.wav");
            misty.CancelSkill(skillsArray[index].UniqueId);
        } 
        else if (!misty.Get("RunningSelectedSkill")) {
            misty.PlayAudio("s_Awe.wav");
            misty.RunSkill(skillsArray[index].UniqueId);
        }
    }   
}