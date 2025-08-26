'use client';

import { useState, useCallback } from 'react';
import { Upload, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const SUPPORTED_FORMATS = [
  'audio/mp3',
  'audio/wav',
  'audio/m4a',
  'audio/aac',
  'audio/ogg',
  'video/mp4',
  'video/webm',
  'video/quicktime'
];

type AudioUploaderProps = {
  onUpload: (file: File) => Promise<void>;
  onError?: (error: string) => void;
  className?: string;
  isLoading?: boolean;
};

export default function AudioUploader({ 
  onUpload, 
  onError, 
  className = '',
  isLoading = false 
}: AudioUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<UploadStatus>(isLoading ? 'uploading' : 'idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Unsupported file format. Please upload an audio or video file.' 
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { 
        valid: false, 
        error: `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` 
      };
    }

    return { valid: true };
  };

  const handleUpload = async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      const errorMsg = validation.error || 'Invalid file';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setStatus('uploading');
    setError(null);
    setProgress(0);

    try {
      await onUpload(file);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      setStatus('error');
      onError?.(errorMessage);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleUpload(files[0]);
      }
    },
    [handleUpload]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const renderStatus = () => {
    switch (status) {
      case 'uploading':
        return (
          <div className="mt-4 w-full">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Uploading... {Math.round(progress)}%
            </p>
          </div>
        );
      case 'success':
        return (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-green-700 dark:text-green-300">
              File uploaded successfully!
            </span>
          </div>
        );
      case 'error':
        return (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-md flex items-start">
            <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-700 dark:text-red-300">
              {error || 'An error occurred during upload. Please try again.'}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <div
        className={`w-full border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${status === 'uploading' ? 'pointer-events-none opacity-75' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          {status === 'idle' ? (
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
          ) : status === 'uploading' ? (
            <div className="h-8 w-8 mb-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
          ) : (
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          )}
          
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
            {isDragging
              ? 'Drop the file here'
              : status === 'uploading'
              ? 'Uploading your file...'
              : status === 'success'
              ? 'Upload complete!'
              : status === 'error'
              ? 'Upload failed. Try again.'
              : 'Drag and drop your file here, or click to browse'}
          </p>
          
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept={SUPPORTED_FORMATS.join(',')}
            onChange={handleFileChange}
            disabled={status === 'uploading'}
          />
          
          <label
            htmlFor="file-upload"
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              status === 'uploading'
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer dark:bg-blue-700 dark:hover:bg-blue-800'
            }`}
          >
            {status === 'uploading' 
              ? 'Uploading...' 
              : status === 'success' 
                ? 'Upload Another File' 
                : 'Select File'}
          </label>
          
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Supported formats: {SUPPORTED_FORMATS.map(f => f.split('/')[1]).join(', ')}
            {` (Max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`}
          </p>
        </div>
      </div>
      {renderStatus()}
    </div>
  );
}
