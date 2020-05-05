/**********************************************************************
Copyright 2019 Misty Robotics, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
imitations under the License.

**WARRANTY DISCLAIMER.**

* General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE "AS-IS" AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
* Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/
**********************************************************************/

/**********************************************************************
externalRequest_getData

This sample shows how to code Misty to get data from an external web
API. In this case, Misty sends a request to the Weatherstack API,
and parses the response to print a message with information about the
current weather to SkillData event listeners.

This sample makes use of the params field in the JSON meta file.
We store the Weatherstack API access key and the name of a city
in the params field to make it easier for other developers to update
the skill with their own unique information. Before you run this skill,
you'll need to replace the key and city values in the
externalRequest_getData.json file with your own Weatherstack API key
and the name of the city in which you live. You can get a Weatherstack
key for free by signing up here: https://weatherstack.com/signup/free

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!

Note: Storing sensitive data (like API keys and credentials) in
the JSON file for your skills is a good practice to follow, especially
when you plan to share your code with other developers. Always remember
to remove private or sensitive information from your skill files before
sharing them on GitHub, in the Misty Community, or elsewhere online.
**********************************************************************/

// Sends a request to the Weatherstack API, using parameters from the
// skill's JSON meta file to fill out the key and city in the resource
// URL. In your skill code, you can reference any values assigned to
// properties in the params object in the skill's JSON meta file by
// calling _params.<propertyName>. In our case, we use
// _params.key and _params.city, respectively.
misty.SendExternalRequest(
    "GET",
    "http://api.weatherstack.com/current?access_key="+_params.key+"&query="+_params.city
    )

/*
Note: By default, when the system sends an external request, our skill
passes the response from the external resource into a callback
function with the same name as the external request command, prefixed
with an underscore (i.e. "_SendExternalRequest()"). You can change the
name of this callback function by passing in a different name as an
optional argument when you call the misty.RegisterEvent() method.
*/

// Parses the response data to get the current condition in
// _params.city and prints this data in a debug message.
function _SendExternalRequest(data) {
    // Parses callback data to pull out response object data. This is
    // the response from our external resource.
    _data = JSON.parse(data.Result.ResponseObject.Data)
    // Parses the response to get the current condition in _params.city
    _condition = _data.current.weather_descriptions[0].toLowerCase();
    // Prints the current condition as a debug message.
    misty.Debug("Misty here! Just letting you know it's " + _condition + " in " + _params.city);
}