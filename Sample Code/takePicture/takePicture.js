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
takePicture

This sample shows how to code Misty to take a picture with her RGB
camera, save the picture to her local storage, and show it on her
display. We also have Misty play a camera shutter sound, so you can
hear (as well as see!) when she's taken the picture.

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!
**********************************************************************/

// Plays Misty's her camera shutter sound at 100% of max volume. This
// sound is one of Misty's default system audio files.
misty.PlayAudio("s_SystemCameraShutter.wav", 100);

// Takes a picture and saves it with the name "photoSaveTest".
// Sets the width of the picture to 375 and the height to 812. The
// first boolean argument tells Misty to save the picture, and the
// second tells Misty to show the picture on her display as soon as
// it's been saved to her local storage.
misty.TakePicture("photoSaveTest.jpg", 375, 812, true, true);