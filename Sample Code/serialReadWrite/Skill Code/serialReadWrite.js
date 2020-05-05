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
serialReadWrite

This sample shows how to code Misty to send/receive messages to/from
a microcontroller connected to the UART serial port on her back.

In this sample, we use two methods from Misty's JavaScript API to
register for incoming serial message (SerialMessage) events. We use the
misty.RegisterEvent() method to create a new event listener for
messages from the UART serial port, and we use the
misty.AddReturnProperty() method to tell the system which SerialMessage
property values those event messages should include.

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!
**********************************************************************/

subscribeToBackpackData();

// Sets up our SerialMessage event listener.
function subscribeToBackpackData() {
    // Tells the system to print the value of the SerialMessage
    // property in the AdditionalResults array that comes back with
    // "backpackMessage" events. This value is the message from the
    // connected microcontroller.
    misty.AddReturnProperty("backpackMessage", "SerialMessage");
    // Registers a new event listener for SerialMessage events. (We
    // call this event listener backpackMessage, but you can use any
    // name you like. Giving event listeners a custom name means you
    // can create multiple event listeners for the same type of event
    // in a single skill.) Our FaceRec event listener has a debounce
    // of 50 ms, and we set the fourth argument (keepAlive) to true,
    // which tells the system to keep listening for FaceRec events
    // after the first message comes back.
    misty.RegisterEvent("backpackMessage", "SerialMessage", 50, true);
}

// Defines how Misty should respond to backpackMessage events. Data
// from each backpackMessage event is passed into this callback
// function.
function _backpackMessage(data) {
    // Prints the contents of the message from the connected
    // microcontroller as a debug message.
    misty.Debug(data.AdditionalResults[0].Message);
}

// Sends a message from Misty to a microcontroller connected to the
// UART serial port on her back.
misty.WriteSerial("Hello! This is Misty sending a string to the serial interface on my back!");