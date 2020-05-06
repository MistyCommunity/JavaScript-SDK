# hazardNotification

This sample shows how to register for hazard notification (`HazardNotification`) event messages. Once you've registered for these
messages, you can use them to program Misty to back up and find another direction when she stops driving due to an obstacle or a cliff in her path.

In this sample, we use the `misty.RegisterEvent()` method from Misty's JavaScript API to register for `HazardNotification` event messages. Data from `HazardNotification` event messages gets passed into a callback function where we write the code that defines how the robot should respond. In our case, this callback function prints an array with the names of the triggered hazards as a debug message. If the message shows that Misty is in a hazards state, we change her LED to white, meaning it's not safe for her to drive. If misty is NOT in a hazard state, we change the LED to white, meaning it is safe for her to drive.

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.

**Tip:** You can extend this sample to write a skill that has Misty autonomously roam her environment, programmatically changing direction each time she enters a hazard state. Because the `DriveStopped` hazards are each associated with a particular "region", you can check which "regions" are unsafe, and use Misty's driving commands to program her to back up and choose a new direction.

---

**WARRANTY DISCLAIMER.**

* General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE “AS-IS” AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
* Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/

--- 

*Copyright 2020 Misty Robotics*<br>
*Licensed under the Apache License, Version 2.0*<br>
*http://www.apache.org/licenses/LICENSE-2.0*
