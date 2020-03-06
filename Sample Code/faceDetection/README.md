# faceDetection

This sample shows how to code Misty to react when she detects a face in her field of view.

In this sample, we use the `misty.RegisterEvent()` method from Misty's JavaScript API to register for face recognition (`FaceRecognition`) event messages. Data from `FaceRecognition` event messages gets passed into a callback function where we write the code that defines how the robot should respond. In this case, Misty responds by raising her arms, showing her happy eyes, and changing the color of her chest LED.

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.