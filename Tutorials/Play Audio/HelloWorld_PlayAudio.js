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
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

// Print a debug message to indicate the skill has started
misty.Debug("starting skill helloworld_playaudio");

// Issue command to fetch list of audio clips
misty.GetAudioList();

// Callback to handle data returned by GetListOfAudioClips()
function _GetAudioList(data) {
    // Check if data was received
    if (data) {
        // Capture the array of files
        let audioArr = data.Result;

        // Generate a random number and use it to choose a filename at 
        // random from the list
        let randNum = Math.floor(Math.random() * audioArr.length);
        let randSound = audioArr[randNum].Name;
        // Print the name of the file
        misty.Debug(randSound);

        // Issue command to play the audio clip
        misty.PlayAudio(randSound);
    }
}