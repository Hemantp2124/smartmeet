// lib/api/audioService.ts
import axios from 'axios';

const API_BASE = '/api/AI/audio';

export const transcribeAudio = async (audioFile: File) => {
  const formData = new FormData();
  formData.append('file', audioFile);
  const { data } = await axios.post(`${API_BASE}/transcribe`, formData);
  return data;
};

export const generateSummary = async (transcription: string) => {
  const { data } = await axios.post(`${API_BASE}/summarize`, { transcription });
  return data;
};

export const generateCode = async (requirements: string) => {
  const { data } = await axios.post(`${API_BASE}/generate-code`, { requirements });
  return data;
};

export const testCode = async (code: string) => {
  const { data } = await axios.post(`${API_BASE}/test-code`, { code });
  return data;
};

export const generateDocumentation = async (code: string) => {
  const { data } = await axios.post(`${API_BASE}/generate-docs`, { code });
  return data;
};