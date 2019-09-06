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
externalRequest_getAudio

This sample shows how to code Misty to get an audio file from an
external resource. In this case, Misty saves the image to her local
storage and plays it through her on-board speakers.

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!
**********************************************************************/

// The URL of the resource to which we send our external request.
// In this example, the resource hosted at this URL is an ominous
// recording of a self-destruction countdown. (We promise your robot
// won't actually self-destruct!)
const url = "http://www.moviesoundclips.net/download.php?id=2631&ft=wav"

// Sends the request to download the audio file.
misty.SendExternalRequest("GET", url, null, null, "{}", true, true, "downloadAudio.wav");

/*
Note: When using external requests in your robot skills and
applications, it can be helpful to understand some of the arguments the
misty.SendExternalRequest() method expects. In our skill, we make use
of the following arguments:

* method (string) - An HTTP request method; in this sample, we use GET.
* resource (string) - The full URI of the resource. In our example, we
use the string assigned to the url variable.
* authorizationType (string) - The authentication type required to
access the resource. Our resource does not expect an auth type, so we
use null.
* token (string) - The authentication credentials required to access
the resource. Our resource does not require credentials, so we use null.
* arguments (string) - The arguments to send with the request, passed
as a string written in JSON format with key-value pairs for each
parameter option. Our request does not require additional arguments, so
we pass an empty JSON string ("{}").
* save (bool) - If true, the robot saves any media asset contained in
the request response to the robot's local storage.
* apply (bool) - If true, the robot immediately uses a media asset once
it has been saved to Misty's local storage. We use true to immediately
play the audio file back through Misty's speakers.
* fileName (string) - The name to give the saved file, including the
appropriate file type extension. We use "downloadAudio.jpg"
*/