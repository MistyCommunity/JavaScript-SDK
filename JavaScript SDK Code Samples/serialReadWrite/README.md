# serialReadWrite

These samples show how to code Misty to send/receive messages to/from a microcontroller connected to the UART serial port on her back.

## Skill Code

We use two methods from Misty's JavaScript API to register for incoming serial message (`SerialMessage`) events. We use the `misty.RegisterEvent()` method to create a new event listener for messages from the UART serial port, and we use the `misty.AddReturnProperty()` method to tell the system which `SerialMessage` property values those event messages should include.

## Misty Backpack for Arduino Code

The Misty Backpack for Arduino directory includes examples that show how to send data to your robot from the Misty Backpack for Arduinousing both hardware and software serial communication.

The Misty Backpack for Arduino supports hardware serial communication over pins D0 and D1. These pins are wired by default to interface with the serial port on Misty's back. 

In addition to this default, you can use the **Misty TX/RX** switch on Misty's Arduino-compatible backpack to toggle the receiver and transmitter pins from D0 and D1 (hardware serial) to D8 and D9 (software serial). This is useful when you want to connect a shield that uses serial communication over the default hardware serial pins.

When using pins D8 and D9 for software serial communication, you must use the [SoftwareSerial](https://www.arduino.cc/en/Reference/SoftwareSerial) library (instead of the [Serial](https://www.arduino.cc/reference/en/language/functions/communication/serial/) library) to communicate with Misty.
