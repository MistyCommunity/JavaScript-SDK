//
// begin license header
//
// This file is part of Pixy CMUcam5 or "Pixy" for short
//
// All Pixy source code is provided under the terms of the
// GNU General Public License v2 (http://www.gnu.org/licenses/gpl-2.0.html).
// Those wishing to use Pixy source code, software and/or
// technologies under different licensing terms should contact us at
// cmucam@cs.cmu.edu. Such licensing terms are available for
// all portions of the Pixy codebase presented here.
//
// end license header
//
// This sketch is a good place to start if you're just getting started with 
// Pixy and Arduino.  This program simply prints the detected object blocks 
// (including color codes) through the serial console.  It uses the Arduino's 
// ICSP SPI port.  For more information go here:
//
// https://docs.pixycam.com/wiki/doku.php?id=wiki:v2:hooking_up_pixy_to_a_microcontroller_-28like_an_arduino-29
//


// I have combined two of the Pixy Example code and Customised them a little bit to suit our application
// On Pixy 
// 1. use advances settings to track only one object with highest confidence 
// 2. set start-up mode to pan tilt 

#include <Pixy2.h>

// This is the main Pixy object 
Pixy2 pixy;
int32_t panOffset, tiltOffset;
int sizeMin, sizeMax, OLD,NEW, towards,count;

void setup()
{
  
  //Serial.print("Starting...\n");
  pixy.init();
  OLD = 0;
  towards = 0;
  Serial.begin(9600);
}

void loop()
{ 
  pixy.ccc.getBlocks();
  if (pixy.ccc.numBlocks) {

       // ~Max size of the ball in pixels
       sizeMin = min(pixy.ccc.blocks[0].m_width, pixy.ccc.blocks[0].m_height);
       sizeMax = max(pixy.ccc.blocks[0].m_width, pixy.ccc.blocks[0].m_height);
      
       if (sizeMin >10) {

          // Heading to ball
          panOffset = (int32_t)pixy.frameWidth/2 - (int32_t)pixy.ccc.blocks[0].m_x;
          
          // Calculating Direction of motion
          NEW = panOffset;
          if (abs(NEW-OLD) > 20) {
            //towards = sign(NEW-OLD,DEC)*1;
            if (NEW-OLD <0) { towards = -1;}
            else { towards = 1;}
            OLD = NEW;
            count = 0;
          } 

          if (abs(NEW-OLD) < 10){
            count++;
            if (count>30){
              towards = 0;
            }
          }
          // This data is sent into misty
          Serial.println("{\"pan\":\""+String(panOffset)+"\",\"size\":\""+String(sizeMax)+"\",\"direction\":\""+String(towards)+"\"}");  
       }
   }  
   delay(200);
}

