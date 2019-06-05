# Misty Reads with Python

This code shows how you can combine Misty's REST endpoints, Python wrapper, and Microsoft Cognitive Service's Vision and Speech API's to have Misty read handwriting!

## Getting Started

To run the `_MistyReadsPython.py_` script you'll need a few things:

1. A Microsoft Cognitive Services account
1. mistyPy installed --> [pip install mistyPy](https://github.com/MistyCommunity/Wrapper-Python)
1. Replace the "PUT COGNITIVE SERVICES KEY HERE" fields with the relevant credentials from Microsoft Azure.
1. Lastly, you'll need to get the IP Address of your robot and put it into the _mistyIPAddress_ value.
1. NOTE: Be sure that Misty can see the handwritten text you are having her read. Also, for printed text there are different parameters required for Cognitive Services to extract printed text.