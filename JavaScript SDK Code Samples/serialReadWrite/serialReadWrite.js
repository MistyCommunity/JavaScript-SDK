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
serialReadWrite

This sample shows how to code Misty to send/receive messages to/from
a microcontroller connected to the UART serial port on her back.

In this sample, we use two methods from Misty's JavaScript API to
register for incoming serial message (SerialMessage) events. We use the
misty.RegisterEvent() method to create a new event listener for
messages from the UART serial port, and we use the
misty.AddReturnProperty() method to tell the system which SerialMessage
property values those event messages should include.

For an example of the code that runs on the microcontroller to send
messages to Misty, see the Misty (Arduino Compatible) backpack topic
in the developer documentation:
https://docs.mistyrobotics.com/misty-ii/robot/misty-ii/#misty-arduino-compatible-backpack

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
misty.WriteSerial("Hello! This is serial RX/TX, testing from Misty!!");