#Make sure you have mistyPy installed --> pip install mistyPy (https://github.com/MistyCommunity/Wrapper-Python)
#Make sure you have twilio installed --> pip install twilio (https://github.com/twilio/twilio-python)

import mistyPy
from twilio.rest import Client 
import time

#Twilio credentials
account_sid = '' 
auth_token = '' 
twilio_activePhoneNumber = ''
twilio_DestinationPhoneNumber = ''

def sendTextMessage(message, receipient_Number):
    '''
    input: message, a string with the message you want to send via Text Message
    output: If the message was successfully sent or not. 

    NOTE: You must input your Twilio account_sid, auth_token, and twilio_activePhoneNumber 
    for this function to work correctly. 
    To get a phone number, follow these instructions: https://support.twilio.com/hc/en-us/articles/223135247-How-to-Search-for-and-Buy-a-Twilio-Phone-Number-from-Console
    '''
    

    #Set up connection
    client = Client(account_sid, auth_token) 
    
    #send request
    message = client.messages.create(from_=twilio_activePhoneNumber, body=message, to=receipient_Number) 
    
    #Unncomment for debugging
    #print(message.sid)

    return True

def unknownPerson(robot):
    '''
    We'll call this function when we encounter an uknown person
    
    NOTE: The assets on your robot will probably be different.
    Be sure to check what assets are on your robot with
    /api/images GET call (Populate Image list on API Explorer)
    '''
    robot.changeImage("Confused.jpg")
    robot.playAudio("045-Wah.wav")
    time.sleep(5)
    robot.changeImage("Content.jpg")

def knownPerson(robot):
    '''
    We'll call this function when we encounter an uknown person
    
    NOTE: The assets on your robot will probably be different.
    Be sure to check what assets are on your robot with
    /api/images GET call (Populate Image list on API Explorer)
    '''
    robot.changeImage("Love.jpg")
    robot.playAudio("french.wav")
    time.sleep(5)

#Connect to Misty, be sure to place your robots IP Address here
robot = mistyPy.Robot("<PUT ROBOT IP ADDRESS HERE>")

#Reset Misty's base pose and expression
robot.moveHead(0,-5,0)
robot.changeImage("Content.jpg") #Make sure your robot has this asset!

#Subscribe to Facial Recognition
robot.subscribe("FaceRecognition")

#Watch for Data coming trhough Web Sockets
prevData = None
lastSentMessage = None

#This loop will run and watch for facial recognition events until 
print("\n Ctrl+C to exit loop \n")
while True:
    #retrieve the most recent data from the web socket
    data = robot.faceRec()
    
    #The web socket will repeat the last response until there is new Data
    if prevData and prevData == data:
        continue

    #Misty willl return the personName, Distance in mm, and elevation in radians
    #Here we will check if there is data we care about
    if len(data) > 1 and "personName" in data.keys():
        name = data["personName"]  

        #useful for debugging
        #print(data)

        if name != 'unknown person':
            #If the person is known, the response will include the person's name!
            knownPerson(robot)
            #Let's send ourselve a text message that our robot saw one of our friends (But let's be careful not to spam.)
            if not lastSentMessage or time.time() - lastSentMessage > 60:
                sendTextMessage("Hey! I just saw " + name + " at the office!", twilio_DestinationPhoneNumber)
                lastSentMessage = time.time()
        else:
            #If the person is not known, the response will be 'unknown person'
            unknownPerson(robot)
    
    #The web socket will return the last data available, let's check that so we don't needlessly do things. 
    prevData = data

#####################

