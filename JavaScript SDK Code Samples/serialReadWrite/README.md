# serialReadWrite

This sample shows how to code Misty to send/receive messages to/from a microcontroller connected to the UART serial port on her back.

In this sample, we use two methods from Misty's JavaScript API to register for incoming serial message (`SerialMessage`) events. We use the `misty.RegisterEvent()` method to create a new event listener for messages from the UART serial port, and we use the `misty.AddReturnProperty()` method to tell the system which `SerialMessage` property values those event messages should include.

For an example of the code that runs on the microcontroller to send messages to Misty, see the [Misty (Arduino Compatible) Backpack topic](https://docs.mistyrobotics.com/misty-ii/robot/misty-ii/#misty-arduino-compatible-backpack) in the developer documentation.