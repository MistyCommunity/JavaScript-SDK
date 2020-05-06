# faceRecognition

*This example was last tested on `robotVersion 1.16.1.10505`*

This sample shows how to code Misty to recognize faces she detects in her field of view. She reacts differently when she detects a known face vs. when she detects an unknown face.

In this sample, we use the `misty.RegisterEvent()` method from Misty's JavaScript API to register for face recognition (`FaceRecognition`) event messages. Data from `FaceRecognition` event messages gets passed into a callback function where we write the code that defines how the robot should respond.

In this case, when Misty sees an unknown person, she raises her arms, changes her LED to red, and raises an eyebrow. When she sees you, she changes her LED to purple, raises her arms, and shows her happy eyes.

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.

**Note:** Before you run this code, you'll need to train Misty to recognize your face. Then, replace the `"<Your-Name>"` string in the `_FaceRec()` callback function with the name Misty associates with your face. You can train Misty to recognize your face by using the Command Center. For more information, see [Face Training & Recognition section](
https://docs.mistyrobotics.com/tools-&-apps/web-based-tools/command-center/#face-training-amp-recognition) of the Command Center documentation.

---

**WARRANTY DISCLAIMER.**

* General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE “AS-IS” AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
* Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/

--- 

*Copyright 2020 Misty Robotics*<br>
*Licensed under the Apache License, Version 2.0*<br>
*http://www.apache.org/licenses/LICENSE-2.0*