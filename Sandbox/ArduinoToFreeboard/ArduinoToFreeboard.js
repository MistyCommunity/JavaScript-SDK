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

// This skill uses Misty's Arduion Backpack and BMP280 (temp and pressure sensor) from Adafruit

// Dashboard used  : www.freeboard.io
// Message carrier : www.dweet.io

// misty.AddPropertyTest(string eventName, string property, string inequality, string valueAsString, string valueType);
// misty.RegisterEvent(string eventName, string messageType, int debounce, [bool keepAlive = false], [string callbackRule = “synchronous”], [string skillToCall = null]);
// Enevent callback function names are event names prefixed with an underscore
misty.AddReturnProperty("SerialMessage", "SerialMessage");
misty.RegisterEvent("SerialMessage", "SerialMessage", 0, true);

// Formating the data in arduino serial print as a json makes it easy to parse here
function _SerialMessage(data) {	
    try{
		if(data !== undefined && data !== null) {
            var obj = JSON.parse(data.AdditionalResults[0].Message);
			var temp    = obj.temperature;
			var kPa     = obj.pressure;
			let threshold = 80.0;
            var alarm = 0;
            if (temp>threshold) {
                alarm = 1;
            }
            var json = {
                "temperature":temp.toString(),
                "pressure":kPa.toString(),
                "alarm":alarm.toString()
            }
            misty.SendExternalRequest("POST", "https://dweet.io/dweet/for/<your_dweet_thing_name>",null,null,null,JSON.stringify(json));
        }
    } catch(err) { misty.Debug("Exception" + JSON.stringify(err)); }
}

// This while loops just keeps the skill alive
while (true) {
    misty.Pause(50);
}