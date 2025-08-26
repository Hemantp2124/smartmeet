// lib/api/meetingsStore.ts
import { mkdir, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export type Meeting = {
  id: string;
  sourceLink?: string;
  title?: string;
  status: 'draft' | 'scheduled' | 'live' | 'processing' | 'completed' | 'archived';
  transcription?: string;
  transcript?: any;
  summary?: any;
  language?: string;
  duration?: number;
  word_count?: number;
  createdAt: string;
  updatedAt: string;
};

const dataDir = join(process.cwd(), 'data');
const dataFile = join(dataDir, 'meetings.json');

async function ensureStore() {
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
  if (!existsSync(dataFile)) {
    await writeFile(dataFile, JSON.stringify({ meetings: [] }, null, 2), 'utf-8');
  }
}

async function readStore(): Promise<{ meetings: Meeting[] }> {
  await ensureStore();
  try {
    const raw = await readFile(dataFile, 'utf-8');
    return JSON.parse(raw || '{"meetings": []}');
  } catch {
    return { meetings: [] };
  }
}

async function writeStore(data: { meetings: Meeting[] }) {
  await ensureStore();
  await writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8');
}

export async function listMeetings(): Promise<Meeting[]> {
  const { meetings } = await readStore();
  return meetings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getMeeting(id: string): Promise<Meeting | undefined> {
  const { meetings } = await readStore();
  return meetings.find(m => m.id === id);
}

export async function createMeeting(input: Omit<Meeting, 'createdAt' | 'updatedAt'>): Promise<Meeting> {
  const now = new Date().toISOString();
  const meeting: Meeting = { ...input, createdAt: now, updatedAt: now } as Meeting;
  const store = await readStore();
  store.meetings.push(meeting);
  await writeStore(store);
  return meeting;
}

export async function deleteMeeting(id: string): Promise<boolean> {
  const store = await readStore();
  const before = store.meetings.length;
  store.meetings = store.meetings.filter(m => m.id !== id);
  const changed = store.meetings.length !== before;
  if (changed) await writeStore(store);
  return changed;
}

export async function updateMeeting(id: string, patch: Partial<Omit<Meeting, 'id' | 'createdAt'>>): Promise<Meeting | null> {
  const store = await readStore();
  const idx = store.meetings.findIndex(m => m.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const current = store.meetings[idx];
  const updated: Meeting = {
    ...current,
    ...patch,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: now,
  };
  store.meetings[idx] = updated;
  await writeStore(store);
  return updated;
}
