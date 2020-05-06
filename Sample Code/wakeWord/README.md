# wakeWord

*This example was last tested on `robotVersion 1.16.1.10505`*

This sample shows how to code Misty to respond when she hears the "Hey, Misty!" key phrase.

When you call the `misty.StartKeyPhraseRecognition()` command, Misty listens for the key phrase by continuously sampling audio from the environment and comparing that audio to her trained key phrase model (in this case, "Hey, Misty!"). Misty does not create or save audio recordings while listening for the key phrase.

You must start key phrase recognition before Misty can send `KeyPhraseRecognized` event messages. We follow these steps to code Misty to respond to the "Hey, Misty!" key phrase:

1. Issue a `misty.StartKeyPhraseRecognition()` command.
2. Register a listener for `KeyPhraseRecognized` events. When Misty hears the key phrase, she sends a message to `KeyPhraseRecognized` event listeners. Note that Misty stops listening for the key phrase each time she hears the wake word, and you need to issue another command to start key phrase recognition to start her listening again.
3. Write the code to handle what Misty should do when she hears the key phrase inside the event callback. For example, you might have Misty turn to face you or start recording audio to hand off to a third-party service for additional processing.

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.

**Note:** To have Misty record what you say (for example, if you want to use speech to invoke other actions), you need to send a `misty.StartRecordingAudio()` command after receiving a ``KeyPhraseRecognized`` event message. You can then do something with that audio file in your code, like hand it off to a third-party service for additional processing. Misty will not record audio and listen for the "Hey, Misty!" key phrase at the same time. Sending a command to start recording audio automatically stops key phrase recognition. To have Misty start listening for the key phrase after recording an audio file, you must issue another `misty.StartKeyPhraseRecognition()` command.

---

**WARRANTY DISCLAIMER.**

* General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE “AS-IS” AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
* Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/

--- 

*Copyright 2020 Misty Robotics*<br>
*Licensed under the Apache License, Version 2.0*<br>
*http://www.apache.org/licenses/LICENSE-2.0*