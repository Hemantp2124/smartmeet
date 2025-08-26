'use client';

import { TranscriptEntry } from '../types';

interface Props {
  items: TranscriptEntry[];
}

export default function TranscriptList({ items }: Props) {
  return (
    <div className="h-96 overflow-y-auto space-y-4 pr-2">
      {items.map((entry, index) => (
        <div key={index} className="border-l-2 border-purple-500/30 pl-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-purple-400">{entry.speaker}</span>
            <span className="text-xs text-gray-500">{entry.time}</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{entry.text}</p>
        </div>
      ))}
    </div>
  );
}
