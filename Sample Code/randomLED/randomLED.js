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
**********************************************************************/

/**********************************************************************
randomLED

This sample shows how to code Misty to change the color of her LED
to a new, random color once every second.

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!
**********************************************************************/

// A helper function that returns a random value between min and max.
// In this sample, we use this to randomize the values we pass into
// the misty.ChangeLED() command.
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Registers for a timer event called LEDdance to invoke the LEDDance()
// _LEDDance() callback function every 1000 ms (1 second). To change
// how quickly the LED changes colors, adjust the value of the second
// argument in this function.
misty.RegisterTimerEvent("LEDDance", 1000, true);

// Sets up the callback function for the LEDDance timer event.
function _LEDDance() {
    // Changes Misty's LED. Uses the getRandomInt() function to
    // generate random values for the the red, green, and blue
    // arguments.
    misty.ChangeLED(getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255));
}