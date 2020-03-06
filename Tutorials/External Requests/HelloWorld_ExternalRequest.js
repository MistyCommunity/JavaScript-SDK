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

misty.Debug("Starting skill HelloWorld_ExternalRequest");

// Send a request to the Weatherstack API, using parameters from the
// skill's JSON meta file for the access_key and city params in the
// resource URL.
misty.SendExternalRequest(
    "GET",
    "http://api.weatherstack.com/current?access_key="+_params.key+"&query="+_params.city
    )

// Parse the response data to get the current condition in _params.city
// and print this in a string to the dev console in the Skill Runner
// web page.
function _SendExternalRequest(data) {
    _data = JSON.parse(data.Result.ResponseObject.Data)
    _condition = _data.current.weather_descriptions[0].toLowerCase();
    misty.Debug("Misty here! Just letting you know it's " + _condition + " in " + _params.city);
}