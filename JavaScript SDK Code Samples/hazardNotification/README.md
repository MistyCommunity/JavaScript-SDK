# hazardNotification

This sample shows how to register for hazard notification (`HazardNotification`) event messages. Once you've registered for these
messages, you can use them to program Misty to back up and find another direction when she stops driving due to an obstacle or a cliff in her path.

In this sample, we use the `misty.RegisterEvent()` method from Misty's JavaScript API to register for `HazardNotification` event messages. Data from `HazardNotification` event messages gets passed into a callback function where we write the code that defines how the robot should respond. In our case, this callback function prints an array with the names of the triggered hazards as a debug message. If the message shows that Misty is in a hazards state, we change her LED to white, meaning it's not safe for her to drive. If misty is NOT in a hazard state, we change the LED to white, meaning it is safe for her to drive.

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.

**Tip:** You can extend this sample to write a skill that has Misty autonomously roam her environment, programmatically changing direction each time she enters a hazard state. Because the `DriveStopped` hazards are each associated with a particular "region", you can check which "regions" are unsafe, and use Misty's driving commands to program her to back up and choose a new direction.