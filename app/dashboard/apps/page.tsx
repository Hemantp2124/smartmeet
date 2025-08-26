'use client';

import { useState } from 'react';
import DashboardLayout from '@/app/components/dashboard/layout/DashboardLayout';
import AppCard from './components/AppCard';
import { Plug, Settings, Send, TrendingUp, MessageSquare, FileText } from 'lucide-react';
import { App } from './types';

// Initial connected apps
const connectedApps: App[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send meeting summaries to your team channels',
    icon: MessageSquare,
    connected: true,
    color: 'from-green-500 to-blue-500',
    lastUsed: '2 hours ago',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Create pages with meeting notes and action items',
    icon: FileText,
    connected: true,
    color: 'from-gray-600 to-gray-800',
    lastUsed: '1 day ago',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Share quick summaries with team members',
    icon: MessageSquare,
    connected: true,
    color: 'from-green-400 to-green-600',
    lastUsed: '3 days ago',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Send automated reports to channels',
    icon: Send,
    connected: true,
    color: 'from-blue-400 to-blue-600',
    lastUsed: '1 week ago',
  },
];

// Initial available apps
const availableApps: App[] = [
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Integrate with your Teams workflow',
    icon: MessageSquare,
    connected: false,
    color: 'from-blue-600 to-purple-600',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Share updates in your Discord server',
    icon: MessageSquare,
    connected: false,
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Create tickets from action items',
    icon: Settings,
    connected: false,
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Add cards to your project boards',
    icon: Settings,
    connected: false,
    color: 'from-blue-400 to-teal-500',
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Track tasks and project progress',
    icon: Settings,
    connected: false,
    color: 'from-pink-500 to-red-500',
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Send reports via email automatically',
    icon: Send,
    connected: false,
    color: 'from-gray-500 to-gray-700',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect to 5000+ apps via automation',
    icon: Plug,
    connected: false,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Log meeting notes to your CRM',
    icon: Settings,
    connected: false,
    color: 'from-orange-400 to-orange-600',
  },
];

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([...connectedApps, ...availableApps]);
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState(false);

  const toggleConnection = (appId: string) => {
    setApps((prevApps) =>
      prevApps.map((app) =>
        app.id === appId
          ? {
              ...app,
              connected: !app.connected,
              lastUsed: !app.connected ? 'Just now' : app.lastUsed,
            }
          : app
      )
    );
  };

  const connectedCount = apps.filter((app) => app.connected).length;
  const availableCount = apps.filter((app) => !app.connected).length;

  const stats = [
    {
      label: 'Connected Apps',
      value: connectedCount.toString(),
      icon: Plug,
      color: 'text-purple-400',
    },
    {
      label: 'Available Apps',
      value: availableCount.toString(),
      icon: Settings,
      color: 'text-blue-400',
    },
    {
      label: 'Reports Sent',
      value: '156',
      icon: Send,
      color: 'text-green-400',
    },
    {
      label: 'Success Rate',
      value: '98%',
      icon: TrendingUp,
      color: 'text-pink-400',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Connect Your Apps</h1>
          <p className="text-gray-400 text-lg">
            Streamline your workflow with seamless integrations
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card text-center">
                <Icon className={`mx-auto mb-2 ${stat.color}`} size={24} />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Connected Apps */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Connected Apps ({connectedCount})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps
              .filter((app) => app.connected)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((app) => (
                <AppCard key={app.id} app={app} onToggle={toggleConnection} />
              ))}
          </div>
        </div>

        {/* Available Apps */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Available Apps ({availableCount})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps
              .filter((app) => !app.connected)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((app) => (
                <AppCard key={app.id} app={app} onToggle={toggleConnection} />
              ))}
          </div>
        </div>

        {/* Quick Setup CTA */}
        <div className="glass-card text-center">
          <h3 className="text-xl font-semibold mb-2">Need Help Setting Up?</h3>
          <p className="text-gray-400 mb-6">
            Our integration wizard makes it easy to connect your favorite apps in minutes.
          </p>
          <button 
            onClick={() => setIsSetupWizardOpen(true)}
            className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900/50 shadow-lg hover:shadow-purple-500/30"
          >
            <Settings size={16} className="mr-2 transition-transform group-hover:rotate-12" />
            <span>Launch Setup Wizard</span>
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
            </span>
          </button>

          {/* Setup Wizard Modal */}
          {isSetupWizardOpen && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">App Setup Wizard</h3>
                  <button 
                    onClick={() => setIsSetupWizardOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h4 className="font-medium mb-3">Select Apps to Connect</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {apps.filter(app => !app.connected).map(app => (
                        <div key={app.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${app.color} flex items-center justify-center`}>
                              <app.icon size={16} className="text-white" />
                            </div>
                            <span>{app.name}</span>
                          </div>
                          <button 
                            onClick={() => toggleConnection(app.id)}
                            className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors"
                          >
                            Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      onClick={() => setIsSetupWizardOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setIsSetupWizardOpen(false);
                        // You could add additional setup completion logic here
                      }}
                      className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Finish Setup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
