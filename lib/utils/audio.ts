export interface AudioUploadResponse {
  success: boolean;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  path: string;
  error?: string;
}

export async function uploadAudioFile(file: File): Promise<AudioUploadResponse> {
  const formData = new FormData();
  formData.append('audio', file);

  try {
    const response = await fetch('/api/audio/process', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload audio');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading audio:', error);
    return {
      success: false,
      filename: '',
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      path: '',
      error: error instanceof Error ? error.message : 'Failed to upload audio',
    };
  }
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
