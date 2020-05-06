/**********************************************************************
Copyright 2019 Misty Robotics, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
imitations under the License.

**WARRANTY DISCLAIMER.**

* General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE "AS-IS" AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
* Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/
**********************************************************************/

/**********************************************************************
capTouch

This sample shows how to code Misty to play different sounds when you
touch the capacitive touch sensors on her head, neck, and chin.

In this sample, we use two methods from Misty's JavaScript API to
register for capacitive touch (TouchSensor) event messages. We use the
misty.RegisterEvent() method to create a new event listener for
messages from Misty's capacitive touch sensors, and we use the
misty.AddReturnProperty() method to tell the system which
TouchSensor property values those event messages should include.

When Misty sends a TouchSensor event message, that message data gets
passed into a callback function where we write the code that defines
how the robot should respond.

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!
**********************************************************************/

// Tells the system to print the value of the sensorPosition property
// in the AdditionalResults array that comes back with "Touched"
// event messages. This value tells us which sensor a Touched event
// message is associated with.
misty.AddReturnProperty("Touched", "sensorPosition");

// Tells the system to print the value of the isContacted property
// in the AdditionalResults array that comes back with "Touched"
// event messages. This value is true when a sensor is touched, and
// false when a sensor is released.
misty.AddReturnProperty("Touched", "isContacted");

// Registers a new event listener for TouchSensor events. (We call this
// event listener Touched, but you can use any name you like. Giving
// event listeners a custom name means you can create multiple event
// listeners for the same type of event in a single skill.) Our Touched
// event listener has a debounce of 50 ms, and we set the fourth
// argument (keepAlive) to true, which tells the system to keep
// listening for Touched events after the first message comes back.
misty.RegisterEvent("Touched", "TouchSensor", 50 ,true);

/*
Note: By default, when the system sends an event message, our skill
passes that message into a callback function with the same name as our
registered event listener, prefixed with an underscore. (In this case,
that's "_Touched()"). You can customize the name of this callback method
by passing in a different name as an optional argument when you call
the misty.RegisterEvent() method.
*/

// Defines how Misty should respond to Touched event messages. The
// data from each Touched event is passed into this callback function.
function _Touched(data) {
    // Assigns the values of sensorPosition and isPressed (the first
    // and second elements in our AdditionalResults array) to variables
    var sensor = data.AdditionalResults[0];
    var isPressed = data.AdditionalResults[1];

    // If isPressed is true, prints a debug message telling us which
    // sensor was touched. If isPressed is false, prints a debug
    // message telling us which sensor was released.
    isPressed ? misty.Debug(sensor+" is Touched") : misty.Debug(sensor+" is Released");

    // If isPressed is true, plays a different sound depending which
    // sensor is touched.
    if (isPressed) {
        if (sensor == "Chin") {
            misty.PlayAudio("s_PhraseOwwww.wav");
        }
        else if (sensor == "HeadRight") {
            misty.PlayAudio("s_PhraseEvilAhHa.wav");
        }
        else if (sensor == "HeadLeft") {
            misty.PlayAudio("s_Distraction.wav");
        }
        else if (sensor == "HeadFront") {
            misty.PlayAudio("s_Acceptance.wav");
        }
        else if (sensor == "HeadBack") {
            misty.PlayAudio("s_Disapproval.wav");
        }
        else if (sensor == "Scruff") {
            misty.PlayAudio("s_Grief.wav");
        }
        else {
            misty.Debug("Sensor Name Unknown");
        }
    }
};

/*
Tip: Misty can react to events in a variety of ways. To make the
reactions in this sample more expressive, add code to the conditional
blocks that run inside in the _Touched() callback function. As a basic
example, you can change the image on Misty's display to her happy eyes
by calling misty.DisplayImage("e_Joy.jpg"), or change the color of her
chest LED to red by calling misty.ChangeLED(255, 255, 255)
*/