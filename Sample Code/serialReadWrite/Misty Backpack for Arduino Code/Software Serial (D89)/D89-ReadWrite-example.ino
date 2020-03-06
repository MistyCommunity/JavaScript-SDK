/**********************************************************************
Copyright 2020 Misty Robotics, Inc.

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


// This example shows how to read/write data from/to Misty when the
// Misty TX/RX switch is set to position D8/9 (software serial)

// With the switch in position D89 we can upload a sketch while the
// backpack is attached to Misty.

// In this example:
// READ : If Misty sends the backpack the character "2", the Debug LED
// connected to Pin 13 turns on.
// READ : If Misty sends the backpack the character "3", the Debug LED
// connected to Pin 13 turns off.
// WRITE: The Arduino sends a message to Misty about the state of the LED


// Use software serial to switch serial interface from default (pins 0
// and 1) to pins 8 and 9

#include <SoftwareSerial.h>
SoftwareSerial MistySerial(8, 9); // RX, TX

void setup() 
{
    // Place your setup code here. Runs once.
    MistySerial.begin(9600);
    pinMode(13,OUTPUT);
}

void loop() 
{
    // Place your main code here. Runs on a loop.
    if (MistySerial.available()) 
    {
        int state = MistySerial.parseInt();
        if (state == 2)
        {
            MistySerial.println("LED ON");
            digitalWrite(13,HIGH);
        }
        else if (state == 3)
        {
            MistySerial.println("LED OFF");
            digitalWrite(13,LOW);
        }
    }
}