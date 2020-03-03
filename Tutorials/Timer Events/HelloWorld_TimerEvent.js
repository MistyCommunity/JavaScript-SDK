/*
*    Copyright 2018 Misty Robotics, Inc.
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

misty.Debug("starting skill helloworld_timerevent");

// global variable to count callbacks
_count = 0;

// Register for TimerEvent
misty.RegisterTimerEvent("TimerEvent", 3000, true);

// TimerEvent callback
function _TimerEvent() {
    if (_count < 5) {
        // Increment _count by 1
        _count = _count + 1;

        // Change LED to random color
        let value1 = Math.floor(Math.random() * (256));
        let value2 = Math.floor(Math.random() * (256));
        let value3 = Math.floor(Math.random() * (256));
        misty.ChangeLED(value1, value2, value3);
    } else {
        // Unregister timer event
        misty.UnregisterEvent("TimerEvent");
        // Turn off LED
        misty.ChangeLED(0, 0, 0);
        // Signal skill end
        misty.Debug("ending skill helloworld_timerevent");
    }
}