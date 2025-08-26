'use client';

import { Clock } from 'lucide-react';
import { Task } from '../types';

interface RemainingTaskListProps {
  tasks: Task[];
}

export default function RemainingTaskList({ tasks }: RemainingTaskListProps) {
  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock size={18} className="text-yellow-400" />
        Remaining Tasks
      </h3>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div key={index} className="bg-white/5 rounded-xl p-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-medium text-sm">{task.task}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.priority === 'High'
                  ? 'bg-red-500/20 text-red-400'
                  : task.priority === 'Medium'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {task.priority}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>{task.assignee}</span>
              <span className={`px-2 py-1 rounded-full ${
                task.status === 'In Progress'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
