'use client';

import { Meeting } from './types';
import { Plus } from 'lucide-react';

export default function MeetingDetails({ meeting }: { meeting: Meeting }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Action Items</h3>
        <button className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded-xl hover:opacity-90 transition">
          <Plus size={16} />
          Add Action Item
        </button>
      </div>
      {meeting.actionItems && meeting.actionItems.length > 0 ? (
        <div className="space-y-3">
          {meeting.actionItems.map((item) => (
            <div key={item.id} className="glass-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{item.text}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                    <span>Assigned to: {item.assignedTo}</span>
                    <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      new Date(item.dueDate) < new Date()
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {new Date(item.dueDate) < new Date() ? 'Overdue' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          No action items found. Click the button above to add one.
        </div>
      )}
    </div>
  );
}
