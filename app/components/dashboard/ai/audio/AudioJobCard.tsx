// Optional: if showing multiple results in a list
import { FileAudio, CheckCircle, Loader2 } from 'lucide-react';
export default function AudioJobCard({
  job,
}: {
  job: {
    filename: string;
    status: 'processing' | 'completed';
  };
}) {
  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <FileAudio className="w-5 h-5 text-purple-400" />
      <div className="flex-1">
        <p className="text-sm">{job.filename}</p>
        <p className="text-xs text-gray-400">
          {job.status === 'processing' ? 'Processing...' : 'Completed'}
        </p>
      </div>
      {job.status === 'completed' ? (
        <CheckCircle className="w-4 h-4 text-green-400" />
      ) : (
        <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
      )}
    </div>
  );
}
