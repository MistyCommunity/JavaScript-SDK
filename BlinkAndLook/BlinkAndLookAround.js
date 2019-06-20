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

// Misty Blinks, Looks around mosty facing forward and moves arms at random

misty.Debug("Moving head and hands to home position");
misty.MoveHeadPosition(0, 0, 0, 100);
misty.Pause(3000);
misty.MoveArmPosition("left", 0, 45);
misty.MoveArmPosition("right", 0, 45);

misty.AddReturnProperty("Touched", "sensorPosition");
misty.AddReturnProperty("Touched", "IsContacted");
misty.RegisterEvent("Touched", "TouchSensor", 50 ,true);

//-------------------------Blink--------------------------------------------------------

// We use a global eyeMemory variable so that we can transition between different emotion like Angry, Sad and Happy through a blink instraed of a hard jump
misty.Set("eyeMemory", "Homeostasis.png");
misty.Set("blinkStartTime",(new Date()).toUTCString());
misty.Set("timeBetweenBlink",5);

function blink_now() {
    misty.Set("blinkStartTime",(new Date()).toUTCString());
    misty.Set("timeBetweenBlink",getRandomInt(2, 8));
    misty.DisplayImage("blinkMisty.png");
    misty.Pause(200);
    misty.DisplayImage(misty.Get("eyeMemory"));
}

//-------------------------Random Hand Movement--------------------------------------------
misty.Set("handsStartTime",(new Date()).toUTCString());
misty.Set("timeBetweenHandMotion",5);

function move_hands() {
    misty.Set("handsStartTime",(new Date()).toUTCString());
	misty.Set("timeBetweenHandMotion",getRandomInt(5, 10));
	misty.MoveArmPosition("left", getRandomInt(0, 7), getRandomInt(50, 100));
	misty.MoveArmPosition("right", getRandomInt(0, 7), getRandomInt(50, 100));
}

//-------------------------Look Around-------------------------------------------------------
misty.Set("lookStartTime",(new Date()).toUTCString());
misty.Set("timeInLook",6.0);

function look_around() {
    misty.Set("lookStartTime",(new Date()).toUTCString());
    misty.Set("timeInLook",getRandomInt(5, 10));
    misty.MoveHeadPosition(gaussianRandom(-5,5), gaussianRandom(-5,5), gaussianRandom(-5,5), 100);
}

//-------------------------Loop---------------------------------------------------------------
while (true) {
	misty.Pause(100);
    if (secondsPast(misty.Get("blinkStartTime")) > misty.Get("timeBetweenBlink")) {
        blink_now();
	}
    if (secondsPast(misty.Get("handsStartTime")) > misty.Get("timeBetweenHandMotion")) {
        move_hands();
	}
	if (secondsPast(misty.Get("lookStartTime")) > misty.Get("timeInLook")) {
		look_around();
	}
}

//-----------------------Support Functions------------------------------------------------
function secondsPast(value) {
	var timeElapsed = new Date() - new Date(value);
    timeElapsed /= 1000;
    return Math.round(timeElapsed); // seconds
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// We use Guassian Random so that a random point Misty chooses to look at stays pretty much in the forward facing cone
// Change Mean and Variance to move the Region of Interest
function gaussianRand() {
    var u = Math.random(); //mean 
    var v = Math.random(); // variance
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; 
    //if (num > 1 || num < 0) gaussianRand(); 
    return num;
}

function gaussianRandom(start, end) {
    return Math.floor(start + gaussianRand() * (end - start + 1));
}


// Touched Section

function _Touched(data)
{
    var sensor = data.AdditionalResults[0];
    var isPressed = data.AdditionalResults[1];
	isPressed ? misty.Debug(sensor+" is Touched") : misty.Debug(sensor+" is Released");
    
    if (isPressed)
    {
        if (sensor == "Chin")
        {            
            misty.PlayAudio("031-Psspewpew.wav");   
        } 
        else if (sensor == "HeadRight")
        {
            misty.PlayAudio("020-Whoap.wav");   
        } 
        else if (sensor == "HeadLeft")
        {
            misty.PlayAudio("015-Meow.wav");   
        } 
        else if (sensor == "HeadFront")
        {
            misty.PlayAudio("003-Screetch.wav");
        } 
        else if (sensor == "HeadBack")
        {
            misty.PlayAudio("006-Sigh-01.wav");
        } 
        else if (sensor == "Scruff")
        {
            misty.PlayAudio("008-Huhurr.wav");
        } 
        else 
        {
            misty.Debug("Sensor Name Unknown");
        }
    }
} 

