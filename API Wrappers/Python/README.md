# mistypython
Python wrapper for Misty REST API

## Requirements
* Python 2.7+
* Requests 2.18.4+
* Six 1.11.0+

## Installation
1. Clone or download the repo
1. Navigate to the download directory
1. Run `python setup.py install`


## Getting Started

1. Set up the Wifi configuration on your robot using the Misty Android or iOS companion app
1. Note the IP address of your robot
1. Start controlling your robot with Python!

```python

from mistypython import MistyRobot
    
def main(argv):

    IP_ADDRESS = "10.0.1.16"

    robot = MistyRobot(IP_ADDRESS)

    robot.ChangeEyes(valence=1, arousal=-1, dominance=0)
    robot.ChangeLED(red=100, green=100, blue=0)

    robot.LocomotionTrack(leftTrackSpeed=3, rightTrackSpeed=3)
    robot.Stop(delay=4)

    robot.SetMood("angry")
    robot.SetMood("sad", delay=3)
    robot.SetMood("love", delay=3)


if __name__ == "__main__":
    main(sys.argv[1:])
```

## How it works
This light-weight wrapper ingests a JSON file that defines the Misty API and creates a MistyRobot Python class with corresponding methods. Right now misty_api.json is a local file distributed with the library. In the future this could be hosted and maintained by Misty Robotics and ingested from a URL.

Convenience methods can be added to the library to combine simple commands into more complex functionality. As an example, `SetMood()` was created to set the robots eyes and LED color simultaneously.

All method arguments are NOT case-sensitive. A `delay` argument can be added to any method and the robot will execute the command after waiting the specified number of seconds.



