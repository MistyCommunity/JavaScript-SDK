import sys
import time
from pprint import pprint

from mistypython import MistyRobot

#---------------------------------------------------------------------------
#---------------------------------------------------------------------------

def main(argv):
    """
    Sample use of Misty Python library
    """

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
