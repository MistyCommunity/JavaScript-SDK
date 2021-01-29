/**********************************************************************
    Copyright 2021 Misty Robotics
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
    **WARRANTY DISCLAIMER.**
    * General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY
    ROBOTICS PROVIDES THIS SAMPLE SOFTWARE "AS-IS" AND DISCLAIMS ALL
    WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
    INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
    PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF
    THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC
    RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO
    WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES
    OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
    * Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT
    YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY
    ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO
    ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT,
    COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE
    OR PRODUCT.
    Please refer to the Misty Robotics End User License Agreement for further
    information and full details:
        https://www.mistyrobotics.com/legal/end-user-license-agreement/
**********************************************************************/

// The Skill : Touch Misty's chin to display her IP address on her face. Touch her chin again to hide it.

misty.Set("IPLayer", false);

misty.AddReturnProperty("Touched", "sensorName");
misty.AddReturnProperty("Touched", "isContacted");
misty.RegisterEvent("Touched", "TouchSensor", 100, true);

function _Touched(data) {
    if (data.AdditionalResults[1] == true) {
        switch (data.AdditionalResults[0]) {
            case "CapTouch_Chin":
                toggleIPLayer();
                break;
            default:
                return;
        }
    }
}

function toggleIPLayer() {
    if (!misty.Get("IPLayer")) {
        misty.GetDeviceInformation();
        misty.SetTextDisplaySettings("IPLayer", null, null, true);
        misty.SetImageDisplaySettings("DefaultImageLayer", null, null, false);
        misty.Set("IPLayer", true);
    }
    else if (misty.Get("IPLayer")) {
        misty.SetTextDisplaySettings("IPLayer", null, null, false);
        misty.SetImageDisplaySettings("DefaultImageLayer", null, null, true);
        misty.Set("IPLayer", false);
    }
}

function _GetDeviceInformation(data) {
	misty.DisplayText(data.Result.IPAddress, "IPLayer");
	misty.SetTextDisplaySettings("IPLayer", false, false, true, 1, 40, 400, true, "Center", "Center", "Normal", 255, 255, 255, 480, 80, true, "Courier New");
}