// app/api/meetings/link/analyze/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { validateRequest } from '@/lib/api/utils/validateRequest';
import { ApiError, handleError } from '@/lib/api/utils/errorHandler';
import { mkdir, unlink, readFile } from 'fs/promises';
import { existsSync, createWriteStream } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import { createMeeting } from '@/lib/api/meetings/store';

const AudioUrlSchema = z.object({
  url: z.string().url('Invalid URL'),
  apiKey: z.string().optional(),
  provider: z.string().optional().default('GPT-4'),
});

// Basic check for audio file extensions when content-type is unknown
const AUDIO_EXT_REGEX = /\.(mp3|wav|m4a|aac|ogg|flac)$/i;
const DOWNLOAD_TIMEOUT_MS = 60000; // 60s
const TRANSCRIBE_TIMEOUT_MS = 120000; // 120s
const SUMMARIZE_TIMEOUT_MS = 60000; // 60s
const MAX_DOWNLOAD_BYTES = 50 * 1024 * 1024; // 50 MB
const uploadDir = join(process.cwd(), 'uploads/link');

function withTimeout(resource: string, options: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const opts = { ...options, signal: controller.signal } as RequestInit;
  return {
    fetch: () => fetch(resource, opts).finally(() => clearTimeout(timer)),
    controller,
  };
}

export async function POST(req: Request) {
  try {
    const { url, apiKey, provider } = await validateRequest(AudioUrlSchema, req);

    // Prepare downloads directory
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true }).catch(() => {});
    }

    // Request with timeout
    const dl = withTimeout(url, { method: 'GET' }, DOWNLOAD_TIMEOUT_MS);
    const head = await dl.fetch();
    if (!head.ok) {
      throw new ApiError('Unable to access the provided URL', head.status || 400);
    }

    const contentType = head.headers.get('content-type') || '';
    const isAudioByHeader = contentType.startsWith('audio/');
    const isAudioByExt = AUDIO_EXT_REGEX.test(new URL(url).pathname);

    if (!isAudioByHeader && !isAudioByExt) {
      throw new ApiError('URL must point to a direct audio file (mp3, wav, m4a, aac, ogg, flac) or return audio content-type', 415);
    }

    // Stream download to temp file with size cap
    const pathname = new URL(url).pathname;
    const name = (pathname.split('/').pop() || 'audio-file').replace(/[^a-zA-Z0-9._-]/g, '_');
    const tempPath = join(uploadDir, `${Date.now()}_${name}`);
    const body = head.body as unknown as ReadableStream<any> | null;
    if (!body) throw new ApiError('No response body from URL', 400);

    const nodeStream = Readable.fromWeb(body as any);
    const ws = createWriteStream(tempPath);
    let downloaded = 0;
    await new Promise<void>((resolve, reject) => {
      nodeStream.on('data', (chunk: Buffer) => {
        downloaded += chunk.length;
        if (downloaded > MAX_DOWNLOAD_BYTES) {
          dl.controller.abort();
          ws.destroy();
          reject(new ApiError('Audio file too large (max 50MB)', 413));
          return;
        }
        ws.write(chunk);
      });
      nodeStream.once('end', () => {
        ws.end();
        resolve();
      });
      nodeStream.once('error', reject);
      ws.once('error', reject);
    });
    const audioBuffer = await readFile(tempPath);

    // Transcribe via Supersmart API (mirror of /api/AI/audio/transcribe)
    const form = new FormData();
    const filename = name || 'audio-file';
    form.append('file', new Blob([audioBuffer]), filename);

    const tx = withTimeout('http://localhost:8000/transcribe-upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey || process.env.SUPERSMART_API_KEY}`,
      },
      body: form,
    }, TRANSCRIBE_TIMEOUT_MS);
    const transcribeResp = await tx.fetch();

    if (!transcribeResp.ok) {
      const err = await transcribeResp.json().catch(() => ({} as any));
      throw new ApiError(err.message || 'Failed to transcribe audio from URL', transcribeResp.status || 502);
    }

    const transcribeData = await transcribeResp.json();
    const transcription: string = transcribeData.transcription || transcribeData.text || '';
    if (!transcription) {
      throw new ApiError('Transcription result missing', 502);
    }

    // Summarize
    let summarizeResp: Response | undefined;
    if (process.env.NEXT_PUBLIC_APP_URL) {
      const sm = withTimeout(`${process.env.NEXT_PUBLIC_APP_URL}/api/AI/audio/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription, apiKey, provider }),
      }, SUMMARIZE_TIMEOUT_MS);
      summarizeResp = await sm.fetch().catch(() => undefined);
    }
    if (!summarizeResp) {
      const sm2 = withTimeout('http://localhost:8000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey || process.env.SUPERSMART_API_KEY}`,
        },
        body: JSON.stringify({ transcript: transcription, provider }),
      }, SUMMARIZE_TIMEOUT_MS);
      summarizeResp = await sm2.fetch();
    }

    if (!summarizeResp || !summarizeResp.ok) {
      const err = summarizeResp ? await summarizeResp.json().catch(() => ({} as any)) : {};
      throw new ApiError((err as any).message || 'Failed to generate summary', (summarizeResp && summarizeResp.status) || 502);
    }

    const summaryData = await summarizeResp.json();

    const newMeetingInput = {
      id: crypto.randomUUID(),
      sourceLink: url,
      status: 'completed' as const,
      transcript: transcribeData.transcript || transcribeData.segments || undefined,
      transcription,
      summary: summaryData.summary || summaryData.data || summaryData,
      language: transcribeData.language,
      duration: transcribeData.duration,
      word_count: transcribeData.word_count,
    };

    const saved = await createMeeting(newMeetingInput as any);

    return NextResponse.json({ success: true, meeting: saved });
  } catch (error) {
    return handleError(error);
  } finally {
    // Best-effort cleanup of any temp files older than current session is omitted for brevity.
  }
}
