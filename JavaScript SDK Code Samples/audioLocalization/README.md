# audioLocalization

This sample shows how to code Misty to localize audio. When this code runs, Misty starts sending audio localization event messages and prints the degree of any arrival speech as a debug message.

In this sample, we use two methods from Misty's JavaScript API to register for audio localization (`SourceTrackDataMessage`) events. We use the `misty.RegisterEvent()` method to create a new event listener for messages from Misty's audio localization system, and we use the `misty.AddReturnProperty()` method to tell the system which SourceTrackDataMessage property values those event messages should include.

When Misty sends an audio localization event message, that message data gets passed into a callback function where we write the code
that defines how the robot should respond.

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.

**Tip:** This sample prints the degree of arrival speech as a debug message. You can extend this sample by adding code to find Misty's current heading (yaw value from IMU), and to calculate a new heading for Misty, so that she can turn to face the person she hears speaking.

**Note:** For audio localization events, the direction Misty's head is facing is her 0/360 degrees. The system calculates the degree of arrival speech relative to this position. We start this sample by positioning Misty's head to face the same direction as her body, but keep in mind that this won't always be the case.
