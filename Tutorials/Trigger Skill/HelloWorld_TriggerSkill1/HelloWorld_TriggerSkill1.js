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

// Return only the PersonName property
misty.AddReturnProperty("FaceRecognition", "PersonName");

// Register for FaceRecognition events.
// For the callback, pass in the GUID for
// HelloWorld_TriggerSkill2.
misty.RegisterEvent("FaceRecognition", "FaceRecognition", 5000, true, "Synchronous", "28c7cb66-91d4-4c8f-a8af-bb667ce18099");

misty.StartFaceRecognition();

// Return data only from rear-facing TOF sensors
misty.AddPropertyTest("BackTOF", "SensorPosition", "==", "Back", "string");
// Return data only when an object is closer than 0.5m
misty.AddPropertyTest("BackTOF", "DistanceInMeters", "<", 0.5, "double");

// Register for TimeOfFlight events.
// For the callback, pass in the GUID for
// HelloWorld_TriggerSkill3.
misty.RegisterEvent("BackTOF", "TimeOfFlight", 5000, true, "Synchronous", "f6cc6095-ae40-4507-a9ef-4c7638bf3ad5");