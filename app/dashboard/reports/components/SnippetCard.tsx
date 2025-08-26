'use client';

import { Snippet } from '../types';

interface SnippetCardProps {
  snippet: Snippet;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
  const initials = snippet.speaker.split(' ').map((n) => n[0]).join('');

  return (
    <div className="bg-white/5 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">{initials}</span>
        </div>
        <div>
          <p className="font-medium text-purple-400">{snippet.speaker}</p>
          <p className="text-xs text-gray-500">{snippet.timestamp}</p>
        </div>
      </div>
      <p className="text-gray-300 leading-relaxed">{snippet.content}</p>
    </div>
  );
}
