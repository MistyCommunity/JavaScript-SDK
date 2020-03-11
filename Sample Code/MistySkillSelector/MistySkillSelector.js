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
function displaySkillName(index) {
    var index = misty.Get("MenuIndex");
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