# serialReadWrite

*This example was last tested on `robotVersion 1.16.1.10505`*

These samples show how to code Misty to send/receive messages to/from a microcontroller connected to the UART serial port on her back.

## Skill Code

We use two methods from Misty's JavaScript API to register for incoming serial message (`SerialMessage`) events. We use the `misty.RegisterEvent()` method to create a new event listener for messages from the UART serial port, and we use the `misty.AddReturnProperty()` method to tell the system which `SerialMessage` property values those event messages should include.

## Misty Backpack for Arduino Code

The Misty Backpack for Arduino directory includes examples that show how to send data to your robot from the Misty Backpack for Arduino using both hardware and software serial communication.

The Misty Backpack for Arduino supports hardware serial communication over pins D0 and D1. These pins are wired by default to interface with the serial port on Misty's back. 

In addition to this default, you can use the **Misty TX/RX** switch on Misty's Arduino-compatible backpack to toggle the receiver and transmitter pins from D0 and D1 (hardware serial) to D8 and D9 (software serial). This is useful when you want to connect a shield that uses serial communication over the default hardware serial pins.

When using pins D8 and D9 for software serial communication, you must use the [SoftwareSerial](https://www.arduino.cc/en/Reference/SoftwareSerial) library (instead of the [Serial](https://www.arduino.cc/reference/en/language/functions/communication/serial/) library) to communicate with Misty.

---

**WARRANTY DISCLAIMER.**

* General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE “AS-IS” AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
* Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/

--- 

*Copyright 2020 Misty Robotics*<br>
*Licensed under the Apache License, Version 2.0*<br>
*http://www.apache.org/licenses/LICENSE-2.0*