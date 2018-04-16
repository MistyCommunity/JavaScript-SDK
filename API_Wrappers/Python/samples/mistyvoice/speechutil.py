from google.cloud import texttospeech

def synthesize_text(text, gender="female"):
    """
    Synthesizes speech from the input string of text.
    Documentation here: https://cloud.google.com/text-to-speech/docs/create-audio
    """

    client = texttospeech.TextToSpeechClient()

    input_text = texttospeech.types.SynthesisInput(text=text)

    # see here for available voices:
    # https://cloud.google.com/text-to-speech/docs/voices

    voice_name = "en-US-Wavenet-F"

    if gender == "male":
        voice_name = "en-US-Wavenet-D"

    voice = texttospeech.types.VoiceSelectionParams(language_code='en-US', name=voice_name)

    # sets response to WAV file
    audio_config = texttospeech.types.AudioConfig(
        audio_encoding=texttospeech.enums.AudioEncoding.LINEAR16)

    response = client.synthesize_speech(input_text, voice, audio_config)

    return response.audio_content

