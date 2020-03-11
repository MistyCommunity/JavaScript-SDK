# MistySkillSelector

This skill lets you use Misty's capacitive touch and bump sensors to view, start, and stop Misty's skills. When it runs:

* Touch Misty's chin to toggle the display layers that show the installed skills and their current run status.
* Touch Misty's front left and right bump sensors to "scroll" through the list of skills.
* Touch Misty's rear left or right bump sensor to start or stop the selected skill.

This skills uses the [`misty.RegisterEvent()`](https://docs.mistyrobotics.com/misty-ii/javascript-sdk/api-reference/#misty-registerevent) method to register for [`TouchSensor`](https://docs.mistyrobotics.com/misty-ii/robot/sensor-data/#touchsensor) and [`BumpSensor`](https://docs.mistyrobotics.com/misty-ii/robot/sensor-data/#bumpsensor) event messages. It uses the [`misty.DisplayText()`](https://docs.mistyrobotics.com/misty-ii/javascript-sdk/api-reference/#misty-displaytext) and [`misty.SetTextDisplaySettings()`](https://docs.mistyrobotics.com/misty-ii/javascript-sdk/api-reference/#misty-settextdisplaysettings) to update Misty's [display layers](https://docs.mistyrobotics.com/misty-ii/robot/misty-ii/#using-misty-39-s-display) in response to the user's actions. 

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.