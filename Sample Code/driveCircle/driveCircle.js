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
driveCircle

This sample shows one option for coding Misty to drive in a circle.

We've left a lot of comments in this code for developers new to the
Misty platform. If you already know your way around, feel free to
ignore them!

Note: The circleDrive() function in this sample expects Misty's heading
(yaw value from IMU) to be 0 when it runs. Misty's heading is set to 0
when Misty boots up; however, because this heading updates continuously
as Misty moves around, we can't be sure what the heading will be when
you run this sample. To work around this, the first call on the
misty.DriveArc() method in this sample rotates Misty back to a heading
of 0.

Note: This is not the only way to programmatically drive Misty in a circle.
Another option is to use Misty's current absolute heading to calculate
new heading values to pass into calls on the misty.DriveArc() method.
**********************************************************************/

// Rotates Misty back to an absolute heading of 0 over 4000ms
misty.DriveArc(0, 0.0, 4000, false);
// Pauses skill execution for 4000ms (when rotation is complete)
misty.Pause(4000);

// Starting from a heading of 0, drives Misty in a 0.5m radius circle.
// Misty drives the circumference of each 1/4 segment of the circle
// over 3000 ms. Driving the full circumference takes ~12 seconds.
function circleDrive() {

    for (var i = 1; i <= 4; i++) {
        misty.DriveArc(i*90, 0.5, 3000, false);
        misty.Pause(2900);
    };

    // Loop to continue driving in a circle. Misty continues driving
    // until the skill is canceled or times out. Remove this line if
    // Misty should only drive in one full circle.
    circleDrive();
}

circleDrive();