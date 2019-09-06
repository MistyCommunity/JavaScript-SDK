# wakeWord

This sample shows how to code Misty to respond when she hears the "Hey, Misty!" key phrase.

When you call the `misty.StartKeyPhraseRecognition()` command, Misty listens for the key phrase by continuously sampling audio from the environment and comparing that audio to her trained key phrase model (in this case, "Hey, Misty!"). Misty does not create or save audio recordings while listening for the key phrase.

You must start key phrase recognition before Misty can send `KeyPhraseRecognized` event messages. We follow these steps to code Misty to respond to the "Hey, Misty!" key phrase:

1. Issue a `misty.StartKeyPhraseRecognition()` command.
2. Register a listener for `KeyPhraseRecognized` events. When Misty hears the key phrase, she sends a message to `KeyPhraseRecognized` event listeners. Note that Misty stops listening for the key phrase each time she hears the wake word, and you need to issue another command to start key phrase recognition to start her listening again.
3. Write the code to handle what Misty should do when she hears the key phrase inside the event callback. For example, you might have Misty turn to face you or start recording audio to hand off to a third-party service for additional processing.

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.

**Note:** To have Misty record what you say (for example, if you want to use speech to invoke other actions), you need to send a `misty.StartRecordingAudio()` command after receiving a ``KeyPhraseRecognized`` event message. You can then do something with that audio file in your code, like hand it off to a third-party service for additional processing. Misty will not record audio and listen for the "Hey, Misty!" key phrase at the same time. Sending a command to start recording audio automatically stops key phrase recognition. To have Misty start listening for the key phrase after recording an audio file, you must issue another `misty.StartKeyPhraseRecognition()` command.