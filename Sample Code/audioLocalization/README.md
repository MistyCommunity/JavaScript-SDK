# audioLocalization

This sample shows how to code Misty to localize audio. When this code runs, Misty starts sending audio localization event messages and prints the degree of any arrival speech as a debug message.

In this sample, we use two methods from Misty's JavaScript API to register for audio localization (`SourceTrackDataMessage`) events. We use the `misty.RegisterEvent()` method to create a new event listener for messages from Misty's audio localization system, and we use the `misty.AddReturnProperty()` method to tell the system which `SourceTrackDataMessage` property values those event messages should include.

When Misty sends an audio localization event message, that message data gets passed into a callback function where we write the code that defines how the robot should respond.

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.

**Tip:** This sample prints the degree of arrival speech as a debug message. You can extend this sample by adding code to find Misty's current heading (yaw value from `IMU`), and to calculate a new heading for Misty, so that she can turn to face the person she hears speaking.

**Note:** For audio localization events, the direction Misty's head is facing is her 0/360 degrees. The system calculates the degree of arrival speech relative to this position. We start this sample by positioning Misty's head to face the same direction as her body, but keep in mind that this won't always be the case.

---

**WARRANTY DISCLAIMER.**

* General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE “AS-IS” AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
* Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/

--- 

*Copyright 2020 Misty Robotics*<br>
*Licensed under the Apache License, Version 2.0*<br>
*http://www.apache.org/licenses/LICENSE-2.0*
