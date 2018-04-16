import sys
import time
import array
import json
import base64
import time
import io

from mistypython.mistyrobot import MistyRobot
import speechutil

#---------------------------------------------------------------------------
#---------------------------------------------------------------------------

def load_speech(robot, text, audio_name=None, play_immediately=False, gender=None):

    audio_content = speechutil.synthesize_text(text, gender=gender)
    audio_stream = io.BytesIO(audio_content)
    byte_array = array.array('B')
    byte_array.fromstring(audio_stream.read())
    audio_stream.close()

    byte_list = [str(x) for x in byte_array.tolist()]

    if not audio_name:
        audio_name="speech_%s.wav" % int(time.time())

    audio_bytes = ",".join(byte_list)

    robot.SaveAudioAssetToRobot(fileNameWithoutPath=audio_name, dataAsByteArrayString=audio_bytes, immediatelyApply=play_immediately, overwriteExisting=True)

    #print "Speech loaded as: %s" % audio_name

    return audio_name


#---------------------------------------------------------------------------

def speak(robot, text, gender=None):

    load_speech(robot, text, audio_name="temp_speech_file.wav", play_immediately=True, gender=gender)

#---------------------------------------------------------------------------

def main(argv): 
    """ Sample using Text-to-Speech API to make Misty speak """

    IP_ADDRESS = "10.0.1.16"
    robot = MistyRobot(IP_ADDRESS)

    """
    goonies = load_speech(robot, "Down here, it's our time. It's our time down here. That's all over the second we ride up Troy's bucket.", gender="male")
    robot.PlayAudioClip(assetId=goonies)
    return
    """

    while True:

        text = raw_input("\r\nWhat should Misty say?\r\n")
        if text:
            robot.SetMood("happy")
            speak(robot, text)
            robot.SetMood("content")


if __name__ == "__main__":
    main(sys.argv[1:])
