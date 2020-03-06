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

misty.Debug("Starting Fire Security!!");

misty.Debug("Centering Head");
misty.MoveHeadPosition(0, 0, 0, 100);
misty.Pause(3000);

misty.AddReturnProperty("SerialMessage", "SerialMessage");
misty.RegisterEvent("SerialMessage", "SerialMessage", 0, true);

misty.Set("StartTime",(new Date()).toUTCString());
misty.Set("alarm",false);

misty.Set("past", 0.0);
misty.Set("slope_down_count",0);
misty.Set("slope_up_count",0);
misty.Set("wait_to_threshold", true);

misty.Set("eyeMemory", "Homeostasis.png");
misty.Set("blinkStartTime",(new Date()).toUTCString());
misty.Set("timeBetweenBlink",5);

misty.Set("lookStartTime",(new Date()).toUTCString());
misty.Set("timeInLook",6.0);

misty.Set("pastState", 0);

misty.Set("red", 148);
misty.Set("green", 0);
misty.Set("blue", 211);
misty.ChangeLED(148, 0, 211);


// ------------------------------------------LED Gradient-------------------------------------------------

function purple_up(){
    var red = misty.Get("red")/10.0;
    var green = misty.Get("green")/10.0;
    var blue = misty.Get("blue")/10.0;
    for (var i = 10; i >=0 ; i=i-1) { 
        misty.ChangeLED(Math.floor(i*red),Math.floor(i*green),Math.floor(i*blue));
        misty.Pause(50);
    }
    for (var i =0; i <=10 ; i=i+1) { 
		misty.ChangeLED(Math.floor(i*14.8),0,Math.floor(i*21.1));
		misty.Pause(50);
    }
    misty.Set("red", 148);
    misty.Set("green", 0);
    misty.Set("blue", 211);
}

function red_up(){
    var red = misty.Get("red")/10.0;
    var green = misty.Get("green")/10.0;
    var blue = misty.Get("blue")/10.0;
    for (var i = 10; i >=0 ; i=i-1) { 
        misty.ChangeLED(Math.floor(i*red),Math.floor(i*green),Math.floor(i*blue));
        misty.Pause(50);
    }
    for (var i =0; i <=10 ; i=i+1) { 
		misty.ChangeLED(Math.floor(i*20),0,0);
		misty.Pause(50);
    }
    misty.Set("red", 200);
    misty.Set("green", 0);
    misty.Set("blue", 0);
}

// ------------------------------------------Blink-----------------------------------------------------

function blink_now(){
    misty.Set("blinkStartTime",(new Date()).toUTCString());
    misty.Set("timeBetweenBlink",getRandomInt(2, 8));
    misty.DisplayImage("blinkMisty.png");
    misty.Pause(200);
    misty.DisplayImage(misty.Get("eyeMemory"));
}

//------------------------------------------Look Around-----------------------------------------------------

function look_around(){
	//misty.Debug("LOOKING AROUND");
    misty.Set("lookStartTime",(new Date()).toUTCString());
    misty.Set("timeInLook",getRandomInt(5, 10));
	misty.MoveHeadPosition(gaussianRandom(-5,1), gaussianRandom(-5,5), gaussianRandom(-5,5), 45);
}

// ------------------------------------------Temperature-----------------------------------------------------

function _SerialMessage(data) {	
	
	try{

		if(data !== undefined && data !== null) {

			var obj = JSON.parse(data.AdditionalResults[0].Message);
			var temp    = obj.temperature;
			var kPa     = obj.pressure;
			let threshold = 80.0; ///////////////////////////////////THRESHOLD
			var alarm = 0;

			if (misty.Get("wait_to_threshold")){

				if (temp < threshold){
					misty.Set("wait_to_threshold", false);
				} else {
					if (temp - misty.Get("past") > 0.0){
						var slope_up_count_increment = 1+ misty.Get("slope_up_count");
						misty.Set("slope_up_count",slope_up_count_increment);
					} else {
						misty.Set("slope_up_count",0);
					}
					if (misty.Get("slope_up_count") >= 5){
						misty.Set("slope_up_count",0);
						misty.Set("wait_to_threshold", false);
					}
				}
			}

			if (temp>threshold && !misty.Get("wait_to_threshold")){
	
				alarm = 1;
		
				if (misty.Get("alarm")){

					// While in alarm, if temp drops down 5 times stop alarm and wait to go below threshold
					if (temp - misty.Get("past") < 0.0 ){
						var slope_down_count_increment = 1+ misty.Get("slope_down_count");
						misty.Set("slope_down_count",slope_down_count_increment);
					} else {
						misty.Set("slope_down_count",0);
					}

					if (misty.Get("slope_down_count") >= 5){
						misty.Set("alarm", false);
						misty.Set("slope_down_count",0);
						misty.Set("wait_to_threshold", true);
						misty.Set("StartTime",(new Date()).toUTCString());
					}

					// Replay Audio after end of clip
					var timeElapsed = new Date() - new Date(misty.Get("StartTime"));
					timeElapsed /= 1000;
					var secondsElapsed = Math.round(timeElapsed);
					if (secondsElapsed>7.0){
						misty.Set("StartTime",(new Date()).toUTCString());
						misty.PlayAudio("alarm.wav");
					}
				} else {
					misty.Set("alarm", true);
					misty.PlayAudio("alarm.wav");
					misty.Set("StartTime",(new Date()).toUTCString());
				}

			} else {
				misty.Set("alarm",false);
			}

			if (misty.Get("pastState")!=alarm){
				if (alarm==1){
					misty.Set("eyeMemory", "Disdainful.png");
					red_up();
					misty.SendExternalRequest("POST", "https://maker.ifttt.com/trigger/<event_name_switch_fireman_on>/with/key/<your_name>",null,null,null,"{}");
					// STOP Driving - Start Driving After 5 seconds
					misty.Drive(0, 0);
					misty.Set("cannotDrive", true);
				} else {
					misty.Set("eyeMemory", "Homeostasis.png");
					purple_up();
					misty.SendExternalRequest("POST", "https://maker.ifttt.com/trigger/<event_name_switch_fireman_off>/with/key/<your_name>",null,null,null,"{}");
				}
				misty.Set("pastState", alarm);
			}
			misty.SendExternalRequest("POST", "https://dweet.io/dweet/for/<your_thing_name>",null,null,null,"{\"temperature\":"+temp.toString()+",\"pressure\":"+kPa.toString()+",\"alarm\":"+alarm.toString()+"}");
			misty.Debug(temp);

			misty.Set("past", temp);

		}
	}
	catch(exception) {
		misty.Debug("Exception" + JSON.stringify(exception));
	}
	//misty.WriteBackpackUart(message);
}

// ------------------------------------------Loop---------------------------------------------------------

// Next 5 Lines are the only lines for Wander outside loop 
misty.Set("tofTriggeredAt",(new Date()).toUTCString());
misty.Set("tofTriggered", false);
registerAll();
misty.Set("driveStartAt",(new Date()).toUTCString());
misty.Set("timeInDrive", getRandomInt(3, 8));

while (true) {
	misty.Pause(50);
	if (secondsPast(misty.Get("blinkStartTime")) > misty.Get("timeBetweenBlink")){
        blink_now();
	}

	if (secondsPast(misty.Get("lookStartTime")) > misty.Get("timeInLook")){
		look_around();
	}

	// Wander - tof
	if (misty.Get("tofTriggered")){
        if (secondsPast(misty.Get("tofTriggeredAt")) > 4.0){
            misty.Set("tofTriggered", false);
            registerAll();
        }
    }

	//Wander - drive
    if (secondsPast(misty.Get("driveStartAt")) > misty.Get("timeInDrive") && !misty.Get("tofTriggered")){
        misty.Set("driveStartAt",(new Date()).toUTCString());
        misty.Drive(getRandomInt(20,25), getRandomInt(-35,35));
        misty.Set("timeInDrive", getRandomInt(3, 8));
    }

}

// ------------------------------------------Supporting Functions------------------------------------------

function secondsPast(value){
	var timeElapsed = new Date() - new Date(value);
    timeElapsed /= 1000;
    return Math.round(timeElapsed); // seconds
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function map (num, in_min, in_max, out_min, out_max) {
	return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function gaussianRand() {
    var u = 0.0, v = 0.0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random() ; //(max - min + 1)) + min
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
}

function gaussianRandom(start, end) {
    return Math.floor(start + gaussianRand() * (end - start + 1));
}

//--------------------------------------TOFs-------------------------------------


function _BackTOF(data) {
	//misty.UnregisterEvent("FrontTOF");

	unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
	let backTOFData = data.PropertyTestResults[0].PropertyParent; 
	misty.Debug(JSON.stringify("Distance: " + backTOFData.DistanceInMeters)); 
	misty.Debug(JSON.stringify("Sensor Position: " + backTOFData.SensorPosition));
	misty.Drive(0,0,0, 200);
	misty.DriveTime(35, 0, 2500);
	misty.Pause(2500);
	misty.Set("cannotDrive",false);
}


function _FrontTOF(data) {
	//misty.UnregisterEvent("FrontTOF");
	unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
	let frontTOFData = data.PropertyTestResults[0].PropertyParent; 
	misty.Debug(JSON.stringify("Distance: " + frontTOFData.DistanceInMeters)); 
	misty.Debug(JSON.stringify("Sensor Position: " + frontTOFData.SensorPosition));
	misty.Drive(0,0,0, 200);
	misty.DriveTime(-35, 0, 2500);
	misty.Pause(1000);
	misty.DriveTime(0, 52, 2500);
	misty.Pause(2500);
	misty.Set("cannotDrive",false);
	
}

function _LeftTOF(data) {
	//misty.UnregisterEvent("FrontTOF");
	unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
	let leftTOFData = data.PropertyTestResults[0].PropertyParent; 
	misty.Debug(JSON.stringify("Distance: " + leftTOFData.DistanceInMeters)); 
	misty.Debug(JSON.stringify("Sensor Position: " + leftTOFData.SensorPosition));
	misty.Drive(0,0,0, 200);
	misty.DriveTime(-35, 0, 2500);
	misty.Pause(1000);
	misty.DriveTime(0, -52, 2500);	
	misty.Pause(2500);
	misty.Set("cannotDrive",false);
	
}

function _RightTOF(data) {
	//misty.UnregisterEvent("FrontTOF");
	unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
	let rightTOFData = data.PropertyTestResults[0].PropertyParent; 
	misty.Debug(JSON.stringify("Distance: " + rightTOFData.DistanceInMeters)); 
	misty.Debug(JSON.stringify("Sensor Position: " + rightTOFData.SensorPosition));
	misty.Drive(0,0,0, 200);
	misty.DriveTime(-35, 0, 2500);
	misty.Pause(1000);
	misty.DriveTime(0, 52, 2500);	
	misty.Pause(2500);
	misty.Set("cannotDrive",false);
	
}


function _Bumped(data) {

	unregisterAll();
	misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
    var sensor = data.AdditionalResults[0];
	misty.Debug(sensor);
	//    Bump_FrontRight
	//    Bump_FrontLeft
	//    Bump_RearLeft
	//    Bump_RearRight
	misty.Drive(0,0,0, 200);
    if (sensor == "Bump_FrontRight"){
		misty.DriveTime(-35, 0, 2500);
		misty.Pause(1000);
		misty.DriveTime(0, 52, 2500);	
		misty.Pause(2500);
	} else if (sensor == "Bump_FrontLeft"){
		misty.DriveTime(-35, 0, 2500);
		misty.Pause(1000);
		misty.DriveTime(0, -52, 2500);	
		misty.Pause(2500);
	} else if (sensor == "Bump_RearLeft"){
		misty.DriveTime(35, 0, 2500);
		misty.Pause(1000);
		misty.DriveTime(0, -52, 2500);
		misty.Pause(2500);
	} else if (sensor == "Bump_RearRight"){
		misty.DriveTime(35, 0, 2500);
		misty.Pause(1000);
		misty.DriveTime(0, 52, 2500);	
		misty.Pause(2500);
	} else {}

	misty.Set("cannotDrive",false);
        
 }

function registerAll(){

	misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string"); 
	misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.15, "double"); 
	misty.RegisterEvent("FrontTOF", "TimeOfFlight", 0, false);

	misty.AddPropertyTest("LeftTOF", "SensorPosition", "==", "Left", "string"); 
	misty.AddPropertyTest("LeftTOF", "DistanceInMeters", "<=", 0.15, "double"); 
	misty.RegisterEvent("LeftTOF", "TimeOfFlight", 0, false);

	misty.AddPropertyTest("RightTOF", "SensorPosition", "==", "Right", "string"); 
	misty.AddPropertyTest("RightTOF", "DistanceInMeters", "<=", 0.15, "double"); 
	misty.RegisterEvent("RightTOF", "TimeOfFlight", 0, false);

	misty.AddPropertyTest("BackTOF", "SensorPosition", "==", "Back", "string"); 
	misty.AddPropertyTest("BackTOF", "DistanceInMeters", "<=", 0.20, "double"); 
	misty.RegisterEvent("BackTOF", "TimeOfFlight", 0, false);

	misty.AddReturnProperty("Bumped", "sensorName",); 
    misty.RegisterEvent("Bumped", "BumpSensor", 250 ,true); 

}


function unregisterAll(){

	try{
		misty.UnregisterEvent("FrontTOF");
	} catch(err) {}
	try{
		misty.UnregisterEvent("BackTOF");
	} catch(err) {}
	try{
		misty.UnregisterEvent("RightTOF");
	} catch(err) {}
	try{
		misty.UnregisterEvent("LeftTOF");
	} catch(err) {}
	try{
		misty.UnregisterEvent("Bumped");  
	} catch(err) {}
}