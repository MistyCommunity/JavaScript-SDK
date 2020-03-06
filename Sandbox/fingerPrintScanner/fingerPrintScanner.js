/*
*    Copyright 2019 Misty Robotics, Inc.
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

// Uses Misty Arduino-Compatible Backpack and uses finger print scanner purchased from Sparkfun

misty.MoveHeadDegrees(0, 0, 0, 30);
_subscribeToBackpackData();

function _subscribeToBackpackData() 
{
    misty.ChangeLED(0, 0, 255);
    misty.DisplayImage("e_DefaultContent.jpg");
    misty.AddReturnProperty("backpackMessage", "SerialMessage");
    misty.RegisterEvent("backpackMessage", "SerialMessage", 50, false);
}

function _backpackMessage(data) 
{
    var status = data.AdditionalResults[0].Message;
    if (status == "PASS") 
    {
        misty.ChangeLED(0, 255, 0); 
        misty.DisplayImage("e_Joy2.jpg");
        misty.PlayAudio("accessGranted.wav", 100);
     } 
     else
     {
        misty.ChangeLED(255, 0, 0); 
        misty.DisplayImage("e_JoyGoofy.jpg");
        misty.PlayAudio("accessDenied.wav", 100);
     }
     misty.RegisterTimerEvent("subscribeToBackpackData", 3000, false);
}
