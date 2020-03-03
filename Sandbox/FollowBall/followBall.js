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

// Misty follows a ball with the help of a Pixycam

// Next three lines not really required 
try{
    misty.UnregisterEvent("SerialMessage");
} catch(e) {}

//Build Up
misty.ChangeLED(0, 0, 255);
misty.MoveHeadPosition(-2, 0, 0, 10);misty.Pause(50);
misty.MoveArmPosition("left", 0, 50);misty.Pause(50);
misty.MoveArmPosition("right", 0, 50);misty.Pause(50);
misty.DisplayImage("minioneyes.png");
// misty.Set("pan", 0);
// misty.Set("size", 0);
misty.Set("pastDirection", 1);
misty.Set("oldError", 0.0);
misty.Set("lastUpdate",(new Date()).toUTCString());
misty.Set("stationedLast",(new Date()).toUTCString());
misty.Set("ballLostTimeout",(new Date()).toUTCString());
misty.Set("tomatoAudio",(new Date()).toUTCString());
misty.Set("timeBtwTomato", getRandomInt(7, 15));
misty.Set("ballLost", true);
misty.Set("ballIdle", false);

// ---------------------------- message from Arduino ---------------------------

function sub_arduino(){
    misty.AddReturnProperty("SerialMessage", "SerialMessage");
    misty.RegisterEvent("SerialMessage", "SerialMessage", 0, true);
}

function _SerialMessage(data) {	
    misty.Set("lastUpdate",(new Date()).toUTCString());

    if (misty.Get("ballLost")){
        misty.PlayAudio("tomato.wav");
    }

    var obj = JSON.parse(data.AdditionalResults[0].Message);
	// misty.Set("pan",obj.pan);
    // misty.Set("size",obj.size);
    // misty.Set("direction",obj.direction);
    var pan = obj.pan;              // this varible lets misty know the heading to the ball
    var size = obj.size-70.0;       // the 70.0 determines the distance you want to maintain between Misty and the Ball (Bigger size - ball is more closer)
    var direction = obj.direction;  // this varble lets misty know if ball was moving to the right or to the left

    var error = pan*2.0/3.0;        // Changing range from 150 to 100
    var control = Math.min(Math.max(-45.0, (0.6*error - 0.2*(misty.Get("oldError")-error))), 45.0); // PD 

    if (direction != misty.Get("pastDirection")){
        if (direction == 0){
            misty.Set("stationedLast",(new Date()).toUTCString());
        } else if (misty.Get("pastDirection") == 0) {
            if (secondsPast(misty.Get("stationedLast")) > 1.0) {
                misty.PlayAudio("tomato.wav");
                misty.DisplayImage("minioneyes.png");
                misty.Set("tomatoAudio",(new Date()).toUTCString());
                misty.Set("timeBtwTomato", getRandomInt(7, 15));
            }
        }
        misty.Set("pastDirection",direction);
    }

    //PD DEBUG
    // misty.Debug("P D");
    // misty.Debug(0.6*error);
    // misty.Debug(0.2*(misty.Get("oldError")-error));
    // misty.Debug((misty.Get("oldError")-error));
    misty.Set("oldError", error);
    misty.Drive(-1.0*size, control);
misty.MoveHeadPosition(null,null, control/14.0);
misty.MoveHeadPosition(null, -1.0*(control/14.0),null);
} 

// checkBallIdle();
// function checkBallIdle(){
// }

// --------------------------- Loop------------------------------------------
sub_arduino();
var flag_lost = false;
var flag_idle = false;
while (true) {
    misty.Pause(100);
    
    if (secondsPast(misty.Get("lastUpdate")) > 1.0) {
        misty.Set("ballLost", true);
        misty.Drive(0, 0);
        if (!flag_lost) { misty.PlayAudio("oops.wav"); flag_lost = true; } 
    } else {
        misty.Set("ballLost", false);
        flag_lost = false;
    }

    if (misty.Get("pastDirection")==0) {
        misty.Pause(50);
        if (secondsPast(misty.Get("stationedLast")) > 5.0) {
            misty.Set("ballIdle", true);
            if (!flag_idle) { misty.PlayAudio("banana.wav"); flag_idle = true; } 
        } 
    } else {
        misty.Set("ballIdle", false);
        flag_idle = false;
    }

    if (misty.Get("ballLost") || misty.Get("ballIdle")) {
        misty.ChangeLED(255, 255, 0);
    } else {
        misty.ChangeLED(0, 0, 255);
        if (secondsPast(misty.Get("tomatoAudio")) > misty.Get("timeBtwTomato")){
            misty.PlayAudio("tomato.wav");
            misty.DisplayImage("minioneyes.png");
            misty.Set("tomatoAudio",(new Date()).toUTCString());
            misty.Set("timeBtwTomato", getRandomInt(7, 15));
        }
    }

    // If ball Idle -> unsubscribe -> drive forward and hit ball -> resubscribe
    // misty.Debug(misty.Get("ballIdle"));   
}

// ------------------------ Support Functions -------------------------------------

function secondsPast(value){
	var timeElapsed = new Date() - new Date(value);
    timeElapsed /= 1000;
    return Math.round(timeElapsed); // seconds
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

