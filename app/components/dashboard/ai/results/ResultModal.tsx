// Optional: modal for detailed view
'use client';
import { X } from 'lucide-react';

export default function ResultModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: {
    filename: string;
    transcription: string;
    summary: string;
    code: string;
  };
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="glass-card max-w-lg w-full p-6 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
        <h2 className="text-lg font-semibold">Result: {data.filename}</h2>
        <div>
          <h3 className="text-sm text-gray-400">Transcription</h3>
          <p className="mt-1 text-sm">{data.transcription}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-400">Summary</h3>
          <p className="mt-1 text-sm">{data.summary}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-400">Generated Code</h3>
          <pre className="bg-white/5 p-4 rounded-lg text-sm overflow-x-auto">{data.code}</pre>
        </div>
      </div>
    </div>
  );
}
