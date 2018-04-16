# MIT License
# 
# Copyright (c) 2018 Cameron Henneke
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

"""Python library for Misty API.

A light-weight wrapper library for the Misty REST API
"""

__author__ = 'hennekec@gmail.com (Cameron Henneke)'

# Standard library imports
import sys
import datetime
import os
import json
import time
import pkg_resources
from pprint import pprint

# Third-party imports
import requests
import six

# Local imports


_MISTY_API_JSON = "misty_api.json"

# TODO: add support for websocket


#---------------------------------------------------------------------------
#---------------------------------------------------------------------------

class MistyRobot(object):


    #---------------------------------------------------------------------------

    def __init__(self, ip_address, port="80"):
        """Constructor for MistyRobot.

        Sets up MistyRobot with methods defined by misty_api.json

        Args:
          ip_address: IP address of Misty robot on local wifi network
          port: port used for connecting with robot. 
        """

        self.ip_address = ip_address
        self.port = port

        self._setup_api_methods()

    #---------------------------------------------------------------------------

    def _add_method(self, rest_name, rest_action, rest_args=None):
        """Adds wrapper method.

        Adds wrapper method to MistyRobot class for specified REST action

        Args:
          rest_method: Misty API method
          rest_action: REST action (get, post)
        """

        method_name = rest_name
        method_args = rest_args

        def post_method(self, **kwargs):

            payload = {}

            if kwargs is not None:
                for key, value in six.iteritems(kwargs):
                    if key == "delay":
                        time.sleep(int(value))
                    else:
                        if key.lower() in method_args:
                            payload[key] = value
                        else:
                            print "%s() invalid argument: %s" % (method_name, key)

            url = "http://%s:%s/api/%s" % (self.ip_address, self.port, method_name)
            response = requests.post(url, json=payload)
            return response


        def get_method(self, **kwargs):
        
            if kwargs is not None:
                for key, value in six.iteritems(kwargs):
                    if key == "delay":
                        time.sleep(int(value))

            url = "http://%s:%s/api/%s" % (self.ip_address, self.port, method_name)
            response = requests.get(url)

            if response.text:
                return json.loads(response.text)

            return {}

        if rest_action == "post":
            setattr(MistyRobot, method_name, post_method)

        elif rest_action == "get":
            setattr(MistyRobot, method_name, get_method)


    #---------------------------------------------------------------------------

    def _setup_api_methods(self):
        """Load API from json

        Loads Misty API commands from json file. Currently this is a local file, but
        this could be extended later to load from a URL hosted by Misty
        """

        resource_package = __name__
        f = pkg_resources.resource_stream(resource_package, _MISTY_API_JSON)
        misty_json = json.loads(f.read())
        f.close()

        for method in misty_json["api"]["methods"]:
            rest_action = method["action"]
            rest_name = method["name"]
            rest_args = method["args"]
            self._add_method(rest_name, rest_action, rest_args)


    #---------------------------------------------------------------------------

    def SetMood(self, mood, delay=0):
        """A fun helper method to set mood of robot

        Sets eyes and LED color from predefined moods

        Args:
          mood: predefined mood
          delay: delay in seconds before setting the mood
        """

        _MOODS = { 
                    "sad" : { "red" : 15, "green" : 160, "blue" : 250, "valence" : -1, "arousal" : -1, "dominance" : 0 },
                    "angry" : { "red" : 160, "green" : 20, "blue" : 20, "valence" : -1, "arousal" : 1, "dominance" : 0 },
                    "groggy" : { "red" : 210, "green" : 215, "blue" : 220, "valence" : 0, "arousal" : -1, "dominance" : 0 },
                    "confused" : { "red" : 130, "green" : 15, "blue" : 250, "valence" : 1, "arousal" : 0, "dominance" : 0 },
                    "content" : { "red" : 15, "green" : 190, "blue" : 70, "valence" : 0, "arousal" : 0, "dominance" : 0 },
                    "concerned" : { "red" : 50, "green" : 115, "blue" : 180, "valence" : 0, "arousal" : 1, "dominance" : 0 },
                    "unamused" : { "red" : 185, "green" : 185, "blue" : 130, "valence" : 1, "arousal" : -1, "dominance" : 0 },
                    "happy" : { "red" : 250, "green" : 245, "blue" : 15, "valence" : 1, "arousal" : 1, "dominance" : 0 },
                    "love" : { "red" : 240, "green" : 90, "blue" : 90, "valence" : 1, "arousal" : 1, "dominance" : 1 }
        }

        if mood in _MOODS:
            mood_values = _MOODS[mood]

        if delay:
            time.sleep(int(delay))

        self.ChangeEyes(valence=mood_values['valence'], arousal=mood_values['arousal'], dominance=mood_values['dominance'])
        self.ChangeLED(red=mood_values['red'], green=mood_values['green'], blue=mood_values['blue'])

    #---------------------------------------------------------------------------

    def DriveStraight(self, seconds=1, delay=0):

        if delay:
            time.sleep(int(delay))

        time_ms = seconds * 1000

        self.DriveTime(linearVelocity=65, angularVelocity=0, timeMS=time_ms, degrees=0)

    #---------------------------------------------------------------------------

    def LeftTurn(self, delay=0):

        if delay:
            time.sleep(int(delay))

        self.DriveTime(linearVelocity=65, angularVelocity=65, timeMS=750, degrees=0)
        
    #---------------------------------------------------------------------------

    def RightTurn(self, delay=0):

        if delay:
            time.sleep(int(delay))

        self.DriveTime(linearVelocity=65, angularVelocity=-65, timeMS=750, degrees=0)



