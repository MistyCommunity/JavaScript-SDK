# recordVideo

This sample shows how to programmatically record and save a new video.


You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.

**Note:** Misty only saves the most recent video recording to her local storage. Recordings are saved with the filename `MistyVideo.mp4`, and this file is overwritten with each new recording. To download a video from your robot, you can use the Command Center, or you can send a request to the `GetRecordedVideo` endpoint in Misty's REST API.