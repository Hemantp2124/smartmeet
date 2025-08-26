// UI to display transcription, summary, code
'use client';
export default function AudioResult({
    data,
  }: {
    data: {
      filename: string;
      transcription: string;
      summary: string;
      code: string;
    };
  }) {
    return (
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Results for {data.filename}</h2>
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
    );
  }
  