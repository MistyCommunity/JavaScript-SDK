# externalRequest_getData

This sample shows how to code Misty to get data from an external web API. In this case, Misty sends a request to the APIXU weather API, and parses the response to print a message with information about the current weather to debug listeners.

This sample makes use of the `params` field in the `externalRequest_getData.json` meta file. We store the APIXU API key and the name of a city in the `params` field to make it easier for other developers to update the skill with their own unique information. Before you run this skill, you'll need to replace the `key` and `city` values in the `externalRequest_getData.json` file with your own APIXU API key and the name of the city in which you live. You can get an APIXU key for free by signing up here: https://www.apixu.com/signup.aspx

You can run this code on your robot by uploading the files from this folder to Misty via the Skill Runner web tool. Alternately, refer to this code sample (or copy and paste it into your own skills) when working on similar functionality.

**Note:** Storing sensitive data (like API keys and credentials) in the JSON file for your skills is a good practice to follow, especially when you plan to share your code with other developers. Always remember to remove private or sensitive information from your skill files before sharing them on GitHub, in the Misty Community, or elsewhere online.