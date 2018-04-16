# mistyvoice
This sample gives Misty a voice using the Google Text-to-Speech API. Once set up, you can make Misty speak anything you type!

## Requirements
* mistypython library
* Google Cloud project with billing enabled
* Google Text-to-Speech API Python Client Library

## Installation
1. Setup a virtualenv for Python in this directory following [these steps](https://cloud.google.com/python/setup#installing_and_using_virtualenv) to avoid muddling your system's default installation.
    ```bash
    sudo -H virtualenv --python python2 env
    ```
    
    Be sure to activate the virtualenv before proceeding.
    ```bash
    source env/bin/activate
    ```
1. Install the [Google Cloud Text-to-Speech API Python Client library](https://cloud.google.com/text-to-speech/docs/reference/libraries).
    ```bash
    sudo -H pip install --upgrade google-cloud-texttospeech
    ```
1. Copy the mistypython directory to this directory.
    ```bash
    cp -r ../../mistypython ./
    ````

1. Create a Google Cloud Project and Service Account key following [steps 1- 4 in the "Before you begin" section](https://cloud.google.com/text-to-speech/docs/quickstart).

1. Save a copy of the Service Account key json file to this directory.
    
1. Add your json credentials to the path for the virtualenv
    ```bash
    export GOOGLE_APPLICATION_CREDENTIALS="name_of_key_file.json"
    ```
    
## Getting Started

1. Run the sample
    ```bash
    python robot_speak.py
    ```
    
    ```python
    > What should Misty say?
    Hi, I'm Misty, how can I help you?
    ```

## How it works
This samples takes the text input and sends it to the the Google Text-to-Speech API. It receives an audio file in response and uploads it to the Misty robot and plays the audio file.


