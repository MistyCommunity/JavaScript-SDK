# Misty Texts with Python

This code shows how you can combine Misty's REST endpoints, Python wrapper, and Twilio's texting API to have Misty send text Messages when she sees a friend.

## Getting Started

To run the `_mistyTexts.py_` script you'll need a few things:

1. A Twilio account with an active phone number (set up an [account here](https://www.twilio.com/), instructions for procuring a phone number [here](https://support.twilio.com/hc/en-us/articles/223135247-How-to-Search-for-and-Buy-a-Twilio-Phone-Number-from-Console))
1. You have mistyPy installed --> [pip install mistyPy](https://github.com/MistyCommunity/Wrapper-Python)
1. You have Twilio's python tools installed --> [pip install twilio](https://github.com/twilio/twilio-python)
1. Replace the _account_sid, auth_token, and twilio_activePhoneNumber_ fields with your credentials from Twilio.
1. Select the phone number you want to send a message to by replacing 'twilio_DestinationPhoneNumber' with your preferred number as a string. Be sure to include the area code!
1. Lastly, you'll need to get the IP Address of your robot and put it into the _robot = mistyPy.Robot()_ call.
1. NOTE: The robot will have to be trained on a face before a text message will be sent. You can check who the robot has been trained on with the 'Get Learned Faces' call in the [API Explorer](http://api-explorer.mistyrobotics.com/)