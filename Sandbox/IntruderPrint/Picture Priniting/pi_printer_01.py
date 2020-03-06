import dweepy
import time
import numpy as np
import cv2
from skimage import io
import os
import subprocess
from gpiozero import Button, LED


def prepare_image():

    robot_ip = "192.168.0.102"
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
    led2.on()
    start = time.time()
    out = subprocess.check_output("wpa_cli -i wlan0 select_network $(wpa_cli -i wlan0 list_networks | grep INSTAX-01558927 | cut -f 1)",shell=True)
    if out == b'OK\n':
        os.system("echo Connecting to Printer Network "+str(time.time()))
        #Add Timeout Reattempt
        while out != b'INSTAX-01558927\n':
            time.sleep(5)
            os.system("echo Waiting for printer to get connected")
            out= subprocess.check_output("iwgetid wlan0 --raw", shell = True)
            if time.time()-start > 20:
                os.system("echo Reattempting connecting to printer from switch_to_printer_n func")
                switch_to_printer_network()
                
            # time.sleep(0.5)
        os.system("echo Connected to Printer Network - wait 15 sec start"+str(time.time()))
        time.sleep(15)
    else:
        # Reattempt connection
        time.sleep(5)
        switch_to_printer_network()
        os.system("echo Reattempting connecting to printer")

def switch_to_robot_network():
    #os.system("wpa_cli -i wlan0 select_network $(wpa_cli -i wlan0 list_networks | grep Misty-Staff | cut -f 1)")
    start = time.time()
    out = subprocess.check_output("wpa_cli -i wlan0 select_network $(wpa_cli -i wlan0 list_networks | grep TP-Link_5958_5G | cut -f 1)",shell = True)
    if out == b'OK\n':
        os.system("echo Connecting to Robot Network "+str(time.time()))
        #Add Timeout Reattempt
        while out != b'TP-Link_5958_5G\n':
            time.sleep(5)
            out= subprocess.check_output("iwgetid wlan0 --raw", shell = True)
            if time.time()-start > 10:
                switch_to_robot_network()
                break
            time.sleep(0.5)
        os.system("echo Connected to Robot Network")
        time.sleep(10)
    else:
        # Reattempt connection
        time.sleep(5)
        switch_to_robot_network()
        os.system("echo Reattempting connecting to Robot Network")

def print_image():
    led.blink(0.1)
    led2.off()
    time.sleep(5)
    os.system("echo Attempting to print" +str(time.time()))
    x = os.system("instax-print Intruder.jpeg -i 1111")
    if x != 0:
        time.sleep(5)
        out= subprocess.check_output("iwgetid wlan0 --raw", shell = True)
        if out != b'INSTAX-01558927\n':
            led2.blink(0.1)
            switch_to_printer_network()
        print_image()
    led.on()

# Check if on the robot network before we start network
out= subprocess.check_output("iwgetid wlan0 --raw", shell = True)
if out != b'TP-Link_5958_5G\n':
    switch_to_robot_network()

led = LED(17)
led2 = LED(5)
led.on()
led2.off()

# Start with a status or make one
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
            os.system("echo Alarm Triggered")
            prepare_image()
            os.system("echo Image Preparation complete")
            switch_to_printer_network()
            print_image()
            switch_to_robot_network()

    except KeyboardInterrupt:
        print ("Program Stopped")
        break

    except:
        pass

