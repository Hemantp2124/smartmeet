'use client';

import { ActionItem } from '../types';

interface Props {
  items: ActionItem[];
}

export default function ActionItemList({ items }: Props) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="bg-white/5 rounded-xl p-4">
          <p className="font-medium text-sm mb-2">{item.task}</p>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Assigned to: {item.assignee}</span>
            <span>Due: {item.due}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
