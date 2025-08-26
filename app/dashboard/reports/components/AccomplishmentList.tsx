'use client';

import { CheckCircle } from 'lucide-react';

interface AccomplishmentListProps {
  items: string[];
}

export default function AccomplishmentList({ items }: AccomplishmentListProps) {
  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CheckCircle size={18} className="text-green-400" />
        Key Accomplishments
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-300 text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
