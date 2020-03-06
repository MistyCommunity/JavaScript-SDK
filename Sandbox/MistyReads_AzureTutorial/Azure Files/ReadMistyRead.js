const rp = require('request-promise');
const fs = require('fs');
const SpeechSubscriptionKey = "<Put Subscription Key Here>";
const VisionSubscriptionKey = "<Put Vision Subscription Key Here>";

// Gets an access token.
function getAccessToken() {
    let options = {
        method: 'POST',
        uri: 'https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken', // Be sure this base URL matches your region
        headers: {
            'Ocp-Apim-Subscription-Key': SpeechSubscriptionKey
        }
    }
    return rp(options);
}

function textToSpeech(accessToken, text, context) {
    // Convert the XML into a string to send in the TTS request.
    let body = '<?xml version="1.0"?><speak version="1.0" xml:lang="en-us"><voice xml:lang="en-us" name="Microsoft Server Speech Text to Speech Voice (en-US, Jessa24kRUS)">' + text + '</voice></speak>';

    let options = {
        method: 'POST',
        baseUrl: 'https://westus.tts.speech.microsoft.com/', // Be sure this base URL matches your region
        url: 'cognitiveservices/v1',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'cache-control': 'no-cache',
            'User-Agent': 'Misty Demo Code',
            'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
            'Content-Type': 'application/ssml+xml'
        },
        body: body
    }

    var dataLength = 0;
    var returnData = ''.toString('base64');
    var soundFile = [];

    let request = rp(options)
        .on('data', function(chunk) {
                dataLength += chunk.length;
                soundFile.push(chunk)
            })
            .on('end', function() {
                context.log('Data Length = ', dataLength);

                // Create new base64 string from the full sound file. 
                var buf = new Buffer(dataLength); 
                for (var i=0,len=soundFile.length,pos=0; i<len; i++) { 
                    soundFile[i].copy(buf, pos); 
                    pos += soundFile[i].length; 
                } 

                context.res = {
                    body: buf.base64Slice()
                };
                context.done();
        });
    return request;

};

function extractText(imageData, context) {
    
    //Pull the text from the image, and pass to TTS to generate speech.
    //First, we'll submit the image to the Vision Endpoint to extract and translate the text. 
    let options = {
        method: 'POST',
        uri: 'https://westus.api.cognitive.microsoft.com/vision/v2.0/read/core/asyncBatchAnalyze', // Be sure this base URL matches your region
        headers: {
            'Ocp-Apim-Subscription-Key': VisionSubscriptionKey,
            'Content-Type': 'application/octet-stream'
        },
        params: {
            'mode': 'Handwritten'
        },
        body: base64ToArrayBuffer(imageData)
    }

    let operation_url = "";
    
    let request = rp(options)
        .on('end', function(response) {
            // Holds the URI used to retrieve the recognized text.
            operation_url = response.headers.Operation-Location;
        })
        .catch(function (err) {
            // POST failed...
            console.debug(err);
        });

    
    // Extracting handwritten text requires two API calls: One call to submit the
    // image for processing, the other to retrieve the text found in the image.
    // This call will get the text from the first request.
    let textToRead = "";
    let getOptions = {
        method: 'GET',
        uri: operation_url,
        headers: {
            'Ocp-Apim-Subscription-Key': subscription_key,
            'Content-Type': 'application/octet-stream'
        },
    }

    let textRequest = rp(getOptions)
        .on('end', function(response) {
            //Compile all the words that was extracted from the image
            for ( var i = 0; i < response.recognitionResults.length; i++ ) {
                textToRead += response.recognitionResults.text + " ";
            }
        })
        .catch(function (err) {
            // Issue retrieving text from image...
            console.debug(err);
        });
    
    // Finally, we'll send the extracted text to the Text-To-Speech engine and return the sound file to Misty.
    try {
        const accessToken = await getAccessToken();
        await textToSpeech(accessToken, textToRead, context);
    } catch (err) {
        context.log(`Something went generating speech: ${err}`);
    }
};

//This is a helper function to format the base64 image from Misty into a ArrayBuffer for Cognitive Services Vision endpoint
function base64ToArrayBuffer(base64) {
    var binary_string =  atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
};

//Here is the primary entry point for the Azure Function
module.exports = async function (context, req) {
    context.log('Misty Reads Azure Function Initialized.');
    
    //Make sure you set your subscription key at the top of this file!
    if (VisionSubscriptionKey == "<Put Subscription Key Here>") {
        context.res = {
            status: 400,
            body: "Error With Vision Service Token"
        };
        
        context.done();
        return;
    };

    if (SpeechSubscriptionKey == "<Put Subscription Key Here>") {
        context.res = {
            status: 400,
            body: "Error With Speech Token"
        };
        
        context.done();
        return;
    };

    let imageData = "";

    // Get image data from initial call
    if (req.query.message || (req.body && req.body.message)) {
        imageData = (req.query.message || req.body.message);
    }
    else {
        context.res = {
            status: 400,
            body: "Please put image data in request body"
        };
        context.done();
        return;
    }

    // Send image to get extraxt and announce text
    try {
        await extractText(imageData, context);
    } catch (err) {
        context.log(`Error Getting Image: ${err}`);
    }
};