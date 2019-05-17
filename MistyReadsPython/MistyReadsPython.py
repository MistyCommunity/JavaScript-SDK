import mistyPy
import os, requests, time
from xml.etree import ElementTree
import requests
from io import BytesIO
import time
import base64
import json

def getTextFromImage(image_path, subscription_key):
    assert subscription_key
    vision_base_url = "https://westus.api.cognitive.microsoft.com/vision/v2.0/"

    text_recognition_url = vision_base_url + "read/core/asyncBatchAnalyze"

    headers = {'Ocp-Apim-Subscription-Key': subscription_key, 'Content-Type': 'application/octet-stream'}
    # Note: The request parameter changed for APIv2.
    # For APIv1, it is 'handwriting': 'true'.
    params  = {'mode': 'Handwritten'}

    image_data = open(image_path, "rb").read()

    response = requests.post(text_recognition_url, headers=headers, params=params, data=image_data)
    response.raise_for_status()

    # Extracting handwritten text requires two API calls: One call to submit the
    # image for processing, the other to retrieve the text found in the image.

    # The recognized text isn't immediately available, so poll to wait for completion.
    analysis = {}
    poll = True
    while (poll):
        response_final = requests.get(response.headers["Operation-Location"], headers=headers)
        analysis = response_final.json()
        print(analysis)
        time.sleep(1)
        if ("recognitionResults" in analysis):
            poll= False 
        if ("status" in analysis and analysis['status'] == 'Failed'):
            poll= False

    results = ""
    if ("recognitionResults" in analysis):
        # Extract the recognized text, with bounding boxes.
            for line in analysis["recognitionResults"][0]["lines"]:
                print(line["text"])
                results += line["text"] + " "

    print(results)
    return [results]

# ---------
class ImageContext(object):
    def __init__(self, subscription_key):
        self.subscription_key = subscription_key

        self.vision_base_url = "https://westus.api.cognitive.microsoft.com/vision/v2.0/describe?maxCandidates=1&language=en"

        self.headers    = {'Ocp-Apim-Subscription-Key': subscription_key,'Content-Type': 'application/octet-stream'}
        self.params     = {'visualFeatures': 'Categories,Description,Color'}
    
    def get_context(self, image_path):
        image_data = open(image_path, "rb").read()
        response = requests.post(self.vision_base_url, headers=self.headers, params=self.params, data=image_data)
        response.raise_for_status()

        # The 'analysis' object contains various fields that describe the image. The most
        # relevant caption for the image is obtained from the 'description' property.
        analysis = response.json()

        captionList = []
        for entry in analysis["description"]["captions"]:
            captionList.append(entry['text'])

        return captionList

class TextToSpeech(object):
    def __init__(self, subscription_key):
        self.subscription_key = subscription_key
        self.access_token = None
        fetch_token_url = "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken"
        headers = {'Ocp-Apim-Subscription-Key': self.subscription_key}
        response = requests.post(fetch_token_url, headers=headers)
        self.access_token = str(response.text)

    '''
    The TTS endpoint requires an access token. This method exchanges your
    subscription key for an access token that is valid for ten minutes.
    '''
    def get_token(self):
        fetch_token_url = "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken"
        headers = {
            'Ocp-Apim-Subscription-Key': self.subscription_key
        }
        response = requests.post(fetch_token_url, headers=headers)
        self.access_token = str(response.text)
    
    def say_this(self, text='Hello', filename=''):
        self.tts = text
        base_url = 'https://westus.tts.speech.microsoft.com/'
        path = 'cognitiveservices/v1'
        constructed_url = base_url + path
        headers = {
            'Authorization': 'Bearer ' + self.access_token,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
            'User-Agent': 'YOUR_RESOURCE_NAME'
        }
        xml_body = ElementTree.Element('speak', version='1.0')
        xml_body.set('{http://www.w3.org/XML/1998/namespace}lang', 'en-us')
        voice = ElementTree.SubElement(xml_body, 'voice')
        voice.set('{http://www.w3.org/XML/1998/namespace}lang', 'en-US')
        voice.set('name', 'Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)')        
        
        voice.text = self.tts
        body = ElementTree.tostring(xml_body)

        response = requests.post(constructed_url, headers=headers, data=body)

        if filename == '':
            filename = time.strftime("%Y%m%d-%H%M")

        '''
        If a success response is returned, then the binary audio is written
        to file in your working directory. It is prefaced by sample and
        includes the date.
        '''
        if response.status_code == 200:
            # with open(filename + '.wav', 'wb') as audio:
            with open('./SoundFiles/' + filename + '.wav', 'wb') as audio:
                audio.write(response.content)
                print("Status code(" + str(response.status_code) + "): " + filename + ".wav is ready for playback.")
                return './SoundFiles/' + filename + '.wav'
        else:
            print("\nStatus code: " + str(response.status_code) + "\nSomething went wrong. Check your subscription key and headers.\n")


#Get Image Context
#-----------------------------
tts = TextToSpeech("PUT COGNITIVE SERVICES KEY HERE") #Cognitive Service Voice Service Subscription Key

time.sleep(1)

mistyIPAddress = "10.0.1.220"

response = requests.get("http://" + mistyIPAddress + "/api/alpha/camera?Base64=true")
response.raise_for_status()
analysis = response.json()

data = analysis[0]["result"]["base64"]
_, b64data = data.split(',')

imgdata = base64.b64decode(b64data)

imgFile = open('./snapshot.jpg', 'wb')
imgFile.write(imgdata)

#Announce Text
toAnnounce = ""
for text in getTextFromImage("./snapshot.jpg", "PUT COGNITIVE SERVICES VISION KEY HERE"): #Cognitive Service Vision Service Subscription Key
    print("---------" + text)
    toAnnounce += text + " or "


if len(toAnnounce) > 4:
    audioFilePath = tts.say_this(toAnnounce[0:-4])

    contents = []
    with open(audioFilePath, 'rb') as fd:
        contents = fd.read()

    byteArrayString = str(list(contents))
    h = {'Content-Type': 'multipart/form-data'}
    # body = { 'FilenameWithoutPath': 'example.wav','DataAsByteArrayString': byteArrayString, 'ImmediatelyApply': False, 'OverwriteExisting': True }
    body = '{FilenameWithoutPath: tts.wav,DataAsByteArrayString: '+byteArrayString+', ImmediatelyApply: false, OverwriteExisting: true }'

    response = requests.post("http://10.0.10.69/api/audio", headers=h, data=body)
    response.raise_for_status()
    robot = mistyPy.Robot(mistyIPAddress)
    robot.playAudio("tts.wav")