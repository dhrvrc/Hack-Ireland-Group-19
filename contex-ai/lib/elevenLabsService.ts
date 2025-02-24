import axios from 'axios';

export class ElevenLabsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateSpeechFromText(
    text: string,
    voiceId: string = 'JBFqnCBsd6RMkjVDRZzb'
  ): Promise<Buffer> {
    // URL now includes the query parameter for the desired output format.
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
    
    // Payload now uses "model_id" per the API spec.
    const payload = {
      text,
      model_id: 'eleven_multilingual_v2'
    };

    const response = await axios.post(url, payload, {
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });

    if (response.status !== 200) {
      throw new Error(`ElevenLabs TTS API error: ${response.data}`);
    }
    return Buffer.from(response.data);
  }
}
