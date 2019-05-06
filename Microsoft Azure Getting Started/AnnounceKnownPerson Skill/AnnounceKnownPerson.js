misty.Debug("Announce Know Person Skill");

misty.RegisterEvent("FaceRecognition", "ComputerVision", 250);
misty.StartFaceRecognition();

function _FaceRecognition(data) {
    misty.Debug("Face Recognition Event Triggered");
    
    // Play an audio clip
    misty.PlayAudioClip("005-OoAhhh.wav");

    // Change LED to white
    misty.ChangeLED(255, 255, 255);
    // Stop face detection
    misty.StopFaceRecognition();

    // Use this to help debug issues!
    // misty.Debug(JSON.stringify(data));
	var name = data.PropertyTestResults[0].PropertyParent.PersonName;

	misty.Debug("I recognize: " + name);

    misty.ChangeDisplayImage("Wonder.png");

    let azureURL = "<Put Azure Endpoint Here>"
    misty.SendExternalRequest("GET", azureURL + "?message=Hi there " + name + "\"", null, null, "text/plain", "{}");

    misty.Pause(4000)
};

function _SendExternalRequest(data) {
	misty.Debug("Response Received");
    // misty.ChangeDisplayImage("Happy.png");

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