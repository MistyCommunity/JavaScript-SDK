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
**********************************************************************/

/**********************************************************************
recordVideo

This sample shows how to programmatically record and save a new video.

Note: Misty only saves the most recent video recording to her local
storage. Recordings are saved with the filename MistyVideo.mp4, and
this file is overwritten with each new recording. To download a video
from your robot, you can use the Command Center, or you can send a
request to the GetRecordedVideo endpoint in Misty's REST API:

Endpoint: GET http://<robot-ip-address>/api/video
Header: Content-type: video/mp4

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!
**********************************************************************/

// Starts Misty recording a video with her RGB camera. Video recordings
// cannot be longer than 10 seconds. Misty stops recording
// automatically if a video reaches 10 seconds before you call
// misty.StopRecordingVideo().
misty.StartRecordingVideo();
// Pauses execution for five seconds.
misty.Pause(5000);
// Stops recording. The video is saved to Misty's local storage with
// the filename MistyVideo.mp4, and can be downloaded via the Command
// Center or retrieved with the GetRecordedVideo command.
misty.StopRecordingVideo();
