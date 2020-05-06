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


**WARRANTY DISCLAIMER.**

* General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE "AS-IS" AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
* Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/
**********************************************************************/


// This example shows how to read/write data from/to Misty when the
// Misty TX/RX switch is set to position D01 (hardware serial)

// With the switch in position D01 we cannot upload a sketch while the
// backpack is attached to Misty. Remove the backpack from Misty,
// upload the sketch, and then re-attach the backpack.

// In this example:
// READ : If Misty sends the backpack the character "2", the Debug LED
// connected to Pin 13 turns on.
// READ : If Misty sends the backpack the character "3", the Debug LED
// connected to Pin 13 turns off.
// WRITE: The Arduino sends a message to Misty about the state of the LED

void setup() 
{
    // Place your setup code here. Runs once.
    Serial.begin(9600);
    pinMode(13,OUTPUT);
}

void loop() 
{
    // Place your main code here. Runs on a loop.
    if (Serial.available()) 
    {
        int state = Serial.parseInt();
        if (state == 2)
        {
            Serial.println("LED ON");
            digitalWrite(13,HIGH);
        }
        else if (state == 3)
        {
            Serial.println("LED OFF");
            digitalWrite(13,LOW);
        }
    }
}