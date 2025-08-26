'use client';

import SnippetCard from '../components/SnippetCard';
import { Snippet } from '../types';

interface SnippetsTabProps {
  snippets: Snippet[];
}

export default function SnippetsTab({ snippets }: SnippetsTabProps) {
  return (
    <div className="glass-card">
      <h3 className="text-xl font-semibold mb-6">Key Meeting Snippets</h3>
      <div className="space-y-6">
        {snippets.map((snippet, index) => (
          <SnippetCard key={index} snippet={snippet} />
        ))}
      </div>
    </div>
  );
}
