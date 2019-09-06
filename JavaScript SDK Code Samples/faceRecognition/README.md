# faceRecognition

This sample shows how to code Misty to recognize faces she detects in her field of view. She reacts differently when she detects a known face vs. when she detects an unknown face.

In this sample, we use the `misty.RegisterEvent()` method from Misty's JavaScript API to register for face recognition (`FaceRecognition`) event messages. Data from `FaceRecognition` event messages gets passed into a callback function where we write the code that defines how the robot should respond.

In this case, when Misty sees an unknown person, she raises her arms, changes her LED to red, and raises an eyebrow. When she sees you, she changes her LED to purple, raises her arms, and shows her happy eyes.

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.

**Note:** Before you run this code, you'll need to train Misty to recognize your face. Then, replace the `"<Your-Name>"` string in the `_FaceRec()` callback function with the name Misty associates with your face. You can train Misty to recognize your face by using the Command Center. For more information, see [Face Training & Recognition section](
https://docs.mistyrobotics.com/tools-&-apps/web-based-tools/command-center/#face-training-amp-recognition) of the Command Center documentation.
