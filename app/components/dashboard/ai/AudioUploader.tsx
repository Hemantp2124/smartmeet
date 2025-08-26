'use client';
import { useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';

export default function AudioUploader({
  onUpload,
}: {
  onUpload: (file: File) => Promise<void>; // make sure the caller returns a Promise
}) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      await onUpload(file);
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 text-center">
      <label
        htmlFor="audio-upload"
        className="cursor-pointer flex flex-col items-center justify-center gap-2 p-4 border border-dashed border-white/30 rounded-xl hover:bg-white/5 transition"
      >
        {loading ? (
          <Loader2 className="animate-spin w-6 h-6 text-purple-400" />
        ) : (
          <>
            <UploadCloud className="w-6 h-6 text-purple-400" />
            <span className="text-sm">Click to upload audio file</span>
          </>
        )}
      </label>
      <input
        id="audio-upload"
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
