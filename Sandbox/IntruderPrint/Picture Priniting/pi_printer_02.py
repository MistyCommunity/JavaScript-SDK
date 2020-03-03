from wireless import Wireless
import dweepy
import time
import numpy as np
import cv2
from skimage import io
import os
import subprocess
from gpiozero import Button, LED

wireless = Wireless()
robot_network_ssid = 'TP-Link_5958_5G'
robot_network_password = '30563452'
printer_ssid = 'INSTAX-01558927'
printer_password = '1111'
robot_ip = "192.168.0.102"

def prepare_image():

    #url_path = "http://"+robot_ip+"/api/alpha/camera?Base64=false"    
    url_path = "http://"+robot_ip+"/api/images?FileName=Intruder.jpg&Base64=false"  
    image = io.imread(url_path)
    b,g,r = cv2.split(image)       
    image = cv2.merge([r,g,b])
    image = cv2.resize(image, (0,0), fx=0.5, fy=0.5) 
    (h, w) = image.shape[:2]
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
    img1 = output
    img2 = cv2.imread('Busted.png',cv2.IMREAD_UNCHANGED)
    img2 = cv2.resize(img2, (0,0), fx=0.5, fy=0.5)
    (lH, lW) = img2.shape[:2]
    (B, G, R, A) = cv2.split(img2)
    B = cv2.bitwise_and(B, B, mask=A)
    G = cv2.bitwise_and(G, G, mask=A)
    R = cv2.bitwise_and(R, R, mask=A)
    img2 = cv2.merge([B, G, R])

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
    led_white.blink(0.1)
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
    led_white.on()
    led_blue.off()
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
    led_blue.on()
    if wireless.current() == printer_ssid:
        os.system("instax-print Intruder.jpeg -i 1111")
    else:
        switch_to_printer_network()
        led_blue.blink(0.1)
    

led_white = LED(17)
led_blue = LED(5)
led_white.on()
led_blue.on()

switch_to_robot_network()

try:
    response = dweepy.get_latest_dweet_for('misty')
    old_status = str(response[0]["created"])
    print("START:",old_status)
except:
    dweepy.dweet_for('misty', {'status': 'script_start'})
    time.sleep(2)

led_blue.blink(0.1)
led_white.blink(0.1)

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

