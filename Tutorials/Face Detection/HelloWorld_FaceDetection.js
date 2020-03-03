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

misty.Debug("starting skill helloworld_facedetection");

// Register for face detection event
misty.RegisterEvent("FaceRecognition", "FaceRecognition", 250);
// Timer event cancels the skill
// if no face is detected after 15 seconds
misty.RegisterTimerEvent("FaceRecognitionTimeout", 15000);

misty.StartFaceDetection();

// FaceDetection event callback
function _FaceRecognition() {
    misty.Debug("Face detected!");
    // Play an audio clip
    misty.PlayAudio("s_Joy3.wav");
    // Change LED to white
    misty.ChangeLED(255, 255, 255);
    // Stop face detection
    misty.StopFaceDetection();
};

// FaceDetectionTimeout callback
function _FaceRecognitionTimeout() {
    misty.Debug("face detection timeout called, it's taking too long...");

    // Change LED to black
    misty.ChangeLED(0, 0, 0);
    misty.StopFaceDetection();
};