# capTouch

This sample shows how to code Misty to play different sounds when you touch the capacitive touch sensors on her head, neck, and chin.

In this sample, we use two methods from Misty's JavaScript API to register for capacitive touch (`TouchSensor`) event messages. We use the `misty.RegisterEvent()` method to create a new event listener for messages from Misty's capacitive touch sensors, and we use the `misty.AddReturnProperty()` method to tell the system which `TouchSensor` property values those event messages should include.

When Misty sends a `TouchSensor` event message, that message data gets passed into a callback function where we write the code that defines how the robot should respond.

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.