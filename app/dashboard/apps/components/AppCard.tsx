import { Plug, X } from 'lucide-react';
import { App } from '@/types';

interface AppCardProps {
  app: App;
  onToggle: (id: string) => void;
}

export default function AppCard({ app, onToggle }: AppCardProps) {
  const Icon = app.icon;

  return (
    <div
      className={`glass-card group ${
        app.connected ? '' : 'hover:bg-white/[0.12] transition-all duration-300'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-r ${app.color} rounded-2xl flex items-center justify-center ${
            app.connected ? '' : 'opacity-60 group-hover:opacity-100 transition-opacity'
          }`}
        >
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              app.connected ? 'bg-green-400' : 'bg-gray-500'
            }`}
          ></div>
          <span
            className={`text-xs font-medium ${
              app.connected ? 'text-green-400' : 'text-gray-500'
            }`}
          >
            {app.connected ? 'Connected' : 'Available'}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">{app.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{app.description}</p>

      {app.connected ? (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Last used: {app.lastUsed || 'Never'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(app.id);
            }}
            aria-label={`Disconnect ${app.name}`}
            title={`Disconnect ${app.name}`}
            className="flex items-center justify-center px-3 py-1.5 text-sm font-medium text-red-400 bg-white/5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-all duration-200 hover:border-red-500/30 hover:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
          >
            <X size={14} className="mr-1.5" />
            <span>Disconnect</span>
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(app.id);
          }}
          aria-label={`Connect ${app.name}`}
          title={`Connect ${app.name}`}
          className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900/50 shadow-lg hover:shadow-purple-500/20"
        >
          <Plug size={16} className="mr-2" />
          <span>Connect</span>
        </button>
      )}
    </div>
  );
}
