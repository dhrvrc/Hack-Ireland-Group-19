import openai
import requests
import os

"""
Minimal proof of concept for integrating Whisper (speech-to-text) and ElevenLabs (text-to-speech).
This outlines how real-time messaging & speech features might be implemented in the Contex-Ai project.

Requirements:
1. openai (for Whisper if using OpenAI's Whisper API)
2. requests (for calling external APIs, e.g., ElevenLabs)
3. an ElevenLabs API key (ELEVENLABS_API_KEY) in your environment
4. an OpenAI API key (OPENAI_API_KEY) in your environment

Note: This is a skeletal implementation showing approach, not production-ready code.
"""

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
assert OPENAI_API_KEY, "Please provide OPENAI_API_KEY in environment"
assert ELEVENLABS_API_KEY, "Please provide ELEVENLABS_API_KEY in environment"

openai.api_key = OPENAI_API_KEY

def transcribe_speech(file_path: str) -> str:
    """
    Transcribe local audio file to text using OpenAI Whisper API.
    """
    with open(file_path, "rb") as audio_file:
        transcript = openai.Audio.transcribe("whisper-1", audio_file)
    return transcript["text"]

def generate_speech_from_text(text: str, voice_id: str = "Adam") -> bytes:
    """
    Fetch TTS audio from ElevenLabs for the given text and voice.
    Return raw audio data as bytes.
    """
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    payload = {
        "text": text,
        "voice_settings": {
          "stability": 0.5,
          "similarity_boost": 0.5
        }
    }
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code != 200:
        raise RuntimeError(f"ElevenLabs TTS API error: {response.text}")
    return response.content

def handle_message_flow(audio_file_path: str) -> bytes:
    """
    High-level example combining:
      1) Transcribe speech to text
      2) Call an LLM or RAG pipeline for AI response
      3) Convert AI response back to speech
    Returns TTS audio bytes.
    """
    # Step 1: Transcribe input speech
    user_text = transcribe_speech(audio_file_path)

    # Step 2: Optionally call a custom prompt or RAG pipeline
    # (Placeholder call to OpenAI ChatCompletion)
    ai_response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": user_text}]
    )
    response_text = ai_response.choices[0].message["content"]

    # Step 3: Convert that response to speech
    audio_content = generate_speech_from_text(response_text, voice_id="Adam")
    return audio_content
