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

misty.AddReturnProperty("SerialMessage", "SerialMessage");
misty.RegisterEvent("SerialMessage", "SerialMessage", 0, true);
 
function _SerialMessage(data) {	
	
	try{

		if(data !== undefined && data !== null) {

			var obj = JSON.parse(data.AdditionalResults[0].Message);
			var message    = obj.message;
        }
    }
	catch(exception) {
		misty.Debug("Exception" + JSON.stringify(exception));
	}
	//misty.WriteBackpackUart(message);
}