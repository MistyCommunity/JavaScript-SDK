# *    Copyright 2018 Misty Robotics, Inc.
# *    Licensed under the Apache License, Version 2.0 (the "License");
# *    you may not use this file except in compliance with the License.
# *    You may obtain a copy of the License at
# *
# *    http://www.apache.org/licenses/LICENSE-2.0
# *
# *    Unless required by applicable law or agreed to in writing, software
# *    distributed under the License is distributed on an "AS IS" BASIS,
# *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# *    See the License for the specific language governing permissions and
# *    limitations under the License.

from wireless import Wireless
import dweepy
import time
import numpy as np
import cv2
from skimage import io
import os
import subprocess
import random
# from gpiozero import Button, LED

wireless = Wireless()
robot_network_ssid = 'TP-Link_5958_5G'
robot_network_password = '30563452'
printer_ssid = 'INSTAX-01558927'
printer_password = '1111'
robot_ip = "192.168.1.104"

pngs = ["Busted.png","Gotcha.png","Wanted.png"]
image_index = random.randint(0,len(pngs)-1)
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml') 
def prepare_image():
    global pngs,image_index,face_cascade
    #url_path = "http://"+robot_ip+"/api/alpha/camera?Base64=false"    
    url_path = "http://"+robot_ip+"/api/images?FileName=Intruder.jpg&Base64=false"  
    image = io.imread(url_path)
    b,g,r = cv2.split(image)       
    image = cv2.merge([r,g,b])
    image = cv2.resize(image, (0,0), fx=0.5, fy=0.5) 
    (h, w) = image.shape[:2]
    # --------Face Detection--------
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) 
    faces = face_cascade.detectMultiScale(gray, 1.3, 5) 
    # -------Misty Logo Overlay-----
    logo = cv2.imread("white.png",cv2.IMREAD_UNCHANGED)
    logo = cv2.resize(logo, (0,0), fx=0.1, fy=0.1)
    (lH, lW) = logo.shape[:2]
    (B, G, R, A) = cv2.split(logo)
    logo = cv2.merge([B, G, R])
    overlay = np.zeros((h, w, 3), dtype="uint8")
    overlay[h - lH - 15:h - 15, w - lW - 40:w - 40] = logo
    output = image.copy()
    output = cv2.addWeighted(overlay, 1.0, output, 1.0, 0)
    #cv2.imshow('test_overlay',output)
    # --------PNG Selection----------
    png = pngs[image_index]
    image_index += 1
    image_index %= len(pngs)
    # ---------PNG Overlay-----------
    img1 = output
    img2 = cv2.imread(png,cv2.IMREAD_UNCHANGED)
    img2 = cv2.resize(img2, (0,0), fx=0.5, fy=0.5)
    (lH, lW) = img2.shape[:2]
    (B, G, R, A) = cv2.split(img2)
    B = cv2.bitwise_and(B, B, mask=A)
    G = cv2.bitwise_and(G, G, mask=A)
    R = cv2.bitwise_and(R, R, mask=A)
    img2 = cv2.merge([B, G, R])

    # ---------PNG Placement----------
    if len(faces)==1:
        x_f,y_f,w_f,h_f = faces[0]
        busted_h = int(w/2.0)
        busted_v = y_f + h_f + 20
        # -----Logo and PNG Overlap avoidance--------
        if busted_v > 600:
            busted_v = int(lH/4.0)
    else:
        busted_h = int(w/2.0)
        busted_v = 600
    
    rows,cols,channels = img2.shape
    roi = img1[busted_v:busted_v+rows, busted_h-int(lW/2.0):busted_h-int(lW/2.0)+cols ]
    img2gray = cv2.cvtColor(img2,cv2.COLOR_BGR2GRAY)
    ret, mask = cv2.threshold(img2gray, 10, 255, cv2.THRESH_BINARY)
    mask_inv = cv2.bitwise_not(mask)
    img1_bg = cv2.bitwise_and(roi,roi,mask = mask_inv)
    img2_fg = cv2.bitwise_and(img2,img2,mask = mask)
    dst = cv2.add(img1_bg,img2_fg)
    img1[busted_v:busted_v+rows, busted_h-int(lW/2.0):busted_h-int(lW/2.0)+cols ] = dst
    cv2.imwrite('Intruder.jpeg',img1)

def switch_to_printer_network():
    wireless.connect(ssid=printer_ssid, password= printer_password)
    time.sleep(3)
    while True:
        try: 
            if wireless.current() == printer_ssid:
                print(wireless.current())
                return True
            time.sleep(2)
        except:
            pass

def switch_to_robot_network():
    wireless.connect(ssid=robot_network_ssid, password= robot_network_password)
    time.sleep(3)
    while True:
        try: 
            if wireless.current() == robot_network_ssid:
                print(wireless.current())
                return True
            time.sleep(2)
        except:
            pass

def print_image():
    if wireless.current() == printer_ssid:
        os.system("instax-print Intruder.jpeg -i 1111")
    else:
        switch_to_printer_network()
    

switch_to_robot_network()

try:
    response = dweepy.get_latest_dweet_for('misty')
    old_status = str(response[0]["created"])
    print("START:",old_status)
except:
    dweepy.dweet_for('misty', {'status': 'script_start'})
    time.sleep(2)

while True:
    try:
        time.sleep(1.5)
        response = dweepy.get_latest_dweet_for('misty')
        new_status = str(response[0]["created"]) 
        print("NOW:  ",new_status)
        if new_status != old_status:
            old_status = new_status
            print("Trigger Alarm")
            print("Preparing Image")
            prepare_image()
            print("Connecting to printer network")
            x = switch_to_printer_network()
            print("Printing Image")
            print_image()
            print("Connecting to robots network")
            x = switch_to_robot_network()

    except KeyboardInterrupt:
        print ("Program Stopped")
        break

    except:
        pass

