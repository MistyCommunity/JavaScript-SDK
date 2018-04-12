import sys
import time
from pprint import pprint

from mistypython import MistyRobot

#---------------------------------------------------------------------------
#---------------------------------------------------------------------------

def main(argv):
    """
    Testing with MistyRobot wrapper
    """

    IP_ADDRESS = "10.0.1.16"

    robot = MistyRobot(IP_ADDRESS)

    print "HELP: %s\r\n" % pprint(robot.GetHelp())
    print "DEVICE INFORMATION: %s\r\n" % pprint(robot.GetDeviceInformation())
    print "BATTERY LEVEL: %s\r\n" % pprint(robot.GetBatteryLevel())
    print "AUDIO CLIPS: %s\r\n" % pprint(robot.GetListOfAudioClips())
    print "AUDIO FILES: %s\r\n" % pprint(robot.GetListOfAudioFiles())
    print "VIDEO CLIPS: %s\r\n" % pprint(robot.GetListOfVideoClips())

    print "SENSORS: %s\r\n" % pprint(robot.GetStringSensorValues())

    robot.LocomotionTrack(leftTrackSpeed=3, rightTrackSpeed=3)
    robot.Stop(delay=4)

    # This API call doesn't seem to work properly or consistently,
    # only moves head down, regardless of values
    #robot.MoveHead(pitch=-5, roll=0, yaw=0, velocity=4)
    #robot.MoveHead(pitch=5, roll=0, yaw=0, velocity=4, delay=3)

    # This API call doesn't seem to work
    robot.DriveTime(linearVelocity=3, angularVelocity=5, timeMS=5000, degrees=0)

    # This API call doesn't seem to work
    robot.Drive(linearVelocity=3, angularVelocity=5)
    robot.Stop(delay=4)

    robot.StartFaceTraining(faceId="person1")
    robot.CancelFaceTraining(delay=5)

    print "LEARNED FACES: %s\r\n" % pprint(robot.GetLearnedFaces())

    robot.ClearLearnedFaces()

    print "LEARNED FACES AFTER CLEAR: %s\r\n" % pprint(robot.GetLearnedFaces())

    robot.SetMood("sad")
    robot.SetMood("angry", delay=3)
    robot.SetMood("groggy", delay=3)
    robot.SetMood("confused", delay=3)
    robot.SetMood("content", delay=3)
    robot.SetMood("concerned", delay=3)
    robot.SetMood("unamused", delay=3)
    robot.SetMood("happy", delay=3)
    robot.SetMood("love", delay=3)



if __name__ == "__main__":
    main(sys.argv[1:])
