// app/api/whisper/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WhisperService } from '@/lib/whisperService';

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming FormData
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    // Instantiate the WhisperService with your OpenAI API key
    const whisperService = new WhisperService(process.env.OPENAI_API_KEY as string);

    // Transcribe the audio; pass file as a Blob and its MIME type
    const transcription = await whisperService.transcribeAudio(file as Blob, file.type);
    return NextResponse.json({ transcription });
  } catch (error: any) {
    console.error('Error in Whisper POST route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
