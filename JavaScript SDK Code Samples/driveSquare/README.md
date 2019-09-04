# driveSquare

This sample shows one option for coding Misty to drive in a square.

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.

**Note:** The `squareDrive()` function in this sample expects Misty's heading (yaw value from `IMU`) to be 0 when it runs. Misty's heading is set to 0 when Misty boots up; however, because this heading updates continuously as Misty moves around, we can't be sure what the heading will be when you run this sample. To work around this, the first call on the `misty.DriveArc()` method in this sample rotates Misty back to a heading of 0.

**Note:** This is not the only way to programmatically drive Misty in a square. Another option is to use Misty's current absolute heading to calculate new heading values to pass into calls on the `misty.DriveArc()` and `misty.driveHeading()` methods.