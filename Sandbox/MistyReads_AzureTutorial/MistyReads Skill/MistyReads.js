/*
**WARRANTY DISCLAIMER.**

* General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE "AS-IS" AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
* Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/
*/
misty.Debug("Starting Misty Reads Skill");
misty.Set("azureURL","<Put Azure Endpoint Here>");

// Register Touch Event
misty.AddReturnProperty("Touched", "sensorName");
misty.RegisterEvent("Touched", "TouchSensor", 250 ,true);

// Touched Event
function _Touched(data) {
	misty.UnregisterEvent("Touched");

	var sensor = data.AdditionalResults[0];
	misty.Debug(sensor);

	switch(sensor) {
		// use the following case statements to aid in debugging or variable time between pictures!
		//
		// case "CapTouch_HeadFront":
		// 	misty.ChangeLED(0,0,255);
		// 	break;
		// case "CapTouch_HeadBack":
		// 	misty.ChangeLED(0,255,0);
		// 	break;
		default:
			misty.ChangeLED(255,0,0);
			misty.Pause(2000);
			misty.TakePicture(false, "newImage", 1200, 1600, false, true);
	}
}

function _TakePicture(data){
    misty.Debug("Picture Taken, Sending image to Cognitive Services");
	let baseImage = data.Result.Base64.replace(/^data:image\/[a-z]+;base64,/, "");

	let azureURL = misty.Get("azureURL")

	misty.SendExternalRequest("POST", azureURL, null, null, "application/octet-stream", base64ToByteArrayString(baseImage));

	misty.Pause(4000);

	//Make misty respond to touch events again. 
	misty.RegisterEvent("Touched", "TouchSensor", 250 ,true);
}

function _SendExternalRequest(data) {
	misty.Debug("Response recieved from Cognitive Services");
    misty.ChangeDisplayImage("Happy.png");

	if (data !== undefined && data !== null) {
        misty.Debug("Got Base64 string");
        misty.SaveAudioAssetToRobot("AzureResponse.wav", base64ToByteArrayString(data.Result.ResponseObject.Data), true, true);
        misty.Pause(7000);
        misty.PlayAudioClip("AzureResponse.wav");
	}
	else {
		misty.Debug("Empty user callback data");
	}
	misty.Pause(3000);
    misty.ChangeLED(0, 0, 0);
    misty.ChangeDisplayImage("Wonder.png");
}

function base64ToByteArrayString(input) {
    misty.Debug("Converting String");
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var Base64 = {
		btoa: (input) => {
			let str = input;
			let output = '';

			for (let block = 0, charCode, i = 0, map = chars;
				str.charAt(i | 0) || (map = '=', i % 1);
				output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

				charCode = str.charCodeAt(i += 3 / 4);

				if (charCode > 0xFF) {
					throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
				}

				block = block << 8 | charCode;
			}

			return output;
		},

		atob: (input) => {
			let str = input.replace(/=+$/, '');
			let output = '';

			if (str.length % 4 == 1) {
				throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
			}
			for (let bc = 0, bs = 0, buffer, i = 0;
				buffer = str.charAt(i++);

				~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
					bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
			) {
				buffer = chars.indexOf(buffer);
			}

			return output;
		}
	}
	try {
		var byteCharacters = Base64.atob(input);
		var bytesLength = byteCharacters.length;
		var bytes = new Uint8Array(bytesLength);
		for (var offset = 0, i = 0; offset < bytesLength; ++i, ++offset) {
			bytes[i] = byteCharacters[offset].charCodeAt(0);
		}
		return bytes.toString();
	} catch (e) {
		misty.Debug("Couldn't convert to byte array: " + e);
		return undefined;
	}
}