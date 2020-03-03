#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>

#define BMP_SCK 4
#define BMP_MISO 5
#define BMP_MOSI 6 
#define BMP_CS 7

//Adafruit_BMP280 bme; // I2C
//Adafruit_BMP280 bme(BMP_CS); // hardware SPI
Adafruit_BMP280 bme(BMP_CS, BMP_MOSI, BMP_MISO,  BMP_SCK);
  
void setup() {
  Serial.begin(9600);
  pinMode(2,OUTPUT);//
  pinMode(3,OUTPUT);//
  digitalWrite(2,HIGH);
  digitalWrite(3,LOW);
  
  //Serial.println(F("BMP280 test"));
  
  if (!bme.begin()) {  
    //Serial.println("Could not find a valid BMP280 sensor, check wiring!");
    while (1);
  }
}
  
void loop() {
    //Serial.println(bme.readPressure());
    //Serial.println();
    delay(1000);
    Serial.println("{\"temperature\":\""+String((bme.readTemperature()*1.8)+32)+"\",\"pressure\":\""+String(bme.readPressure()/1000.0)+"\"}");
}
