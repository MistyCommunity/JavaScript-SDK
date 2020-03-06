misty.Debug("Centering Head");
misty.MoveHeadPosition(0, 0, 0, 100);
misty.Pause(3000);

//Register Cap Touch to trigger events
misty.AddReturnProperty("Touched", "sensorName");
misty.AddReturnProperty("Touched", "IsContacted");
misty.RegisterEvent("Touched", "TouchSensor", 50 ,true);

//Register Bump Sensor events
misty.AddReturnProperty("Bumped", "sensorName",);
misty.AddReturnProperty("Bumped", "IsContacted");
misty.RegisterEvent("Bumped", "BumpSensor", 50 ,true);

// -----------------------------Cap Touch--------------------------------------------------------

misty.Set("touchTimeout", 3);

function _Touched(data) {

	var sensor = data.AdditionalResults[0];
	var isPressed = data.AdditionalResults[1];
	isPressed ? misty.Debug(sensor+" is Touched") : misty.Debug(sensor+" is Released");
	
	if (isPressed)
    	{

		switch(sensor) {
			case "CapTouch_HeadFront":
				misty.ChangeLED(0,0,255); //Blue
				misty.DisplayImage("Happy.png");
				misty.Set("touchTimeout", 6);
				misty.MoveHeadPosition(null, -4.5,null);
				break;
			case "CapTouch_HeadBack":
				misty.ChangeLED(218,165,20); //Gold
				misty.PlayAudio("head_amp.wav");
				misty.DisplayImage("Wonder.png");
				misty.Set("touchTimeout", 6);
				misty.MoveHeadPosition(null, 4.5,null);
				break;
			case "CapTouch_HeadRight":
		   		misty.ChangeLED(255,255,255); //White
				misty.PlayAudio("head_amp.wav");
				misty.DisplayImage("Wonder.png");
				misty.Set("touchTimeout", 6);
				misty.MoveHeadPosition(null, 4.5,null);
				break;
			case "CapTouch_HeadLeft":
		 	    misty.ChangeLED(169,169,169); //Silver
				misty.PlayAudio("head_amp.wav");
				misty.DisplayImage("Wonder.png");
				misty.Set("touchTimeout", 6);
				misty.MoveHeadPosition(null, 4.5,null);
				break;
			case "CapTouch_Scruff":
		        misty.ChangeLED(255,0,0); //Red
				misty.PlayAudio("head_amp.wav");
				misty.DisplayImage("Wonder.png");
				misty.Set("touchTimeout", 6);
				misty.MoveHeadPosition(null, 4.5,null);
				break;
			default:
				misty.ChangeLED(0,255,0) //Green
			    misty.PlayAudio("043-Bbbaaah.wav");
				misty.DisplayImage("Angry.png");
				misty.Set("blinkStartTime",(new Date()).toUTCString());
				misty.Set("timeBetweenBlink",3);
				misty.Set("touchTimeout", 3);
		}
	}
}

//--------------------------------------Bump Sensor----------------------------------------------------------------

function _Bumped(data) {

    var sensor = data.AdditionalResults[0];
	misty.Debug(sensor);
	// misty.Drive(0,0,0, 200);

    if (sensor === "Bump_FrontRight") {
        misty.Debug("Bump_FrontRight");
		misty.ChangeLED(255,80,0) //Orange
        // misty.DriveTime(-35, 0, 2500);
		// misty.Pause(1000);
		misty.DriveTime(0, 52, 2500);
		misty.Pause(2500);
	} else if (sensor === "Bump_FrontLeft") {
        misty.Debug("Bump_FrontLeft");
        misty.ChangeLED(180,105,255) //Pink
		// misty.DriveTime(-35, 0, 2500);
		// misty.Pause(1000);
		misty.DriveTime(0, -52, 2500);	
		misty.Pause(2500);
	} else if (sensor === "Bump_RearLeft") {
        misty.Debug("Bump_RearRight");
        misty.ChangeLED(148,0,211) //Purple
		// misty.DriveTime(35, 0, 2500);
		// misty.Pause(1000);
		misty.DriveTime(0, -52, 2500);
		misty.Pause(2500);
	} else {
		// Bump_RearLeft
        misty.ChangeLED(255,255,0) //Yellow
        misty.Debug("Bump_RearLeft");
		// misty.DriveTime(35, 0, 2500);
		// misty.Pause(1000);
		misty.DriveTime(0, 52, 2500);	
		misty.Pause(2500);
	}       
 }

 //-------------------------Blink--------------------------------------------------------
misty.Set("eyeMemory", "Homeostasis.png");
misty.Set("blinkStartTime",(new Date()).toUTCString());
misty.Set("timeBetweenBlink",5);

function blink_now(){
    misty.Set("blinkStartTime",(new Date()).toUTCString());
    misty.Set("timeBetweenBlink",getRandomInt(2, 8));
    misty.DisplayImage("blinkMisty.png");
    misty.Pause(200);
    misty.DisplayImage(misty.Get("eyeMemory"));
}

//--------------------------Red LED Gradient----------------------------------------------------

function red_up(){
    var red = misty.Get("red")/10.0;
    var green = misty.Get("green")/10.0;
    var blue = misty.Get("blue")/10.0;
    for (var i = 10; i >=0 ; i=i-1) { 
        misty.ChangeLED(Math.floor(i*red),Math.floor(i*green),Math.floor(i*blue));
        misty.Pause(50);
    }
    for (var i =0; i <=10 ; i=i+1) { 
		misty.ChangeLED(Math.floor(i*20),0,0);
		misty.Pause(50);
    }
    misty.Set("red", 200);
    misty.Set("green", 0);
    misty.Set("blue", 0);
}
