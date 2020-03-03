# propertyTest

This sample shows how to code Misty to apply a property test to event listeners, so that Misty ignores messages from an event that do not meet the requirements you define in your code.

You can use property tests any time you register a new event listener. In this sample, we filter messages from Misty's time-of-flight sensors, so that our event callback only triggers when the front-center sensor detects an obstacle closer than 15 cm. This event listener ignores messages that come from the other time-of-flight sensors, and it doesn't pass along data from the front center sensor unless its
distance reading is less than or equal to 15 cm.

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.

**Note:** To test this code, start the skill without any obstacles in front of Misty's front center time-of-flight sensor. Then, slowly bring your hand closer to the front of Misty's base. When the front center sensor detects that your hand is closer than 0.15 cm, Misty's LED should change to red.