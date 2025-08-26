import OpenAI from 'openai';
import { logInfo, logError, logDebug } from '@/lib/utils/logger';

// Helper function to get the appropriate Blob constructor
function getBlobConstructor() {
  if (typeof Blob !== 'undefined') {
    return Blob;
  }
  // This will be replaced by webpack/rollup in the browser
  return require('buffer').Blob;
}

export interface TranscriptionResult {
  text: string;
  language: string;
  duration: number;
  segments?: {
    id: number;
    start: number;
    end: number;
    text: string;
  }[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(
  audioBuffer: Buffer,
  mimeType: string = 'audio/webm',
  language: string = 'en'
): Promise<TranscriptionResult> {
  try {
    logInfo('Starting audio transcription', {
      mimeType,
      language,
      bufferSize: audioBuffer.length
    });

    // Create a Blob from the buffer
    const BlobClass = getBlobConstructor();
    const audioBlob = new BlobClass([audioBuffer], { type: mimeType });
    
    // Create a File-like object
    const audioFile = new File([audioBlob as BlobPart], 'recording.webm', { type: mimeType });
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'json',
      temperature: 0.2,
      language: language,
    });

    logInfo('Audio transcription completed', {
      textLength: transcription.text.length
    });

    return {
      text: transcription.text,
      language,
      duration: 0, // You might want to extract this from the audio metadata
    };
  } catch (error) {
    logError('Error transcribing audio', error, { mimeType, language });
    throw new Error('Failed to transcribe audio');
  }
}

export async function transcribeAudioWithTimestamps(
  audioBuffer: Buffer,
  mimeType: string = 'audio/webm',
  language: string = 'en'
): Promise<TranscriptionResult> {
  try {
    logInfo('Starting audio transcription with timestamps', {
      mimeType,
      language,
      bufferSize: audioBuffer.length
    });

    // Create a Blob from the buffer
    const BlobClass = getBlobConstructor();
    const audioBlob = new BlobClass([audioBuffer], { type: mimeType });
    
    // Create a File-like object
    const audioFile = new File([audioBlob as BlobPart], 'recording.webm', { type: mimeType });
    
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'verbose_json',
      temperature: 0.2,
      language: language,
      timestamp_granularities: ['segment']
    });

    const data = response as any;
    
    logInfo('Audio transcription with timestamps completed', {
      textLength: data.text.length,
      segmentsCount: data.segments?.length
    });
    
    return {
      text: data.text,
      language,
      duration: data.duration,
      segments: data.segments?.map((segment: any) => ({
        id: segment.id,
        start: segment.start,
        end: segment.end,
        text: segment.text,
      })),
    };
  } catch (error) {
    logError('Error transcribing audio with timestamps', error, { mimeType, language });
    throw new Error('Failed to transcribe audio with timestamps');
  }
}
