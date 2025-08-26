'use client';

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ResultTabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  className?: string;
}

const ResultTabs: React.FC<ResultTabsProps> = ({
  tabs,
  defaultTabId,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTabId || (tabs.length > 0 ? tabs[0].id : '')
  );

  if (tabs.length === 0) {
    return null;
  }

  const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <div className={`${className}`}>
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{activeTabData.content}</div>
    </div>
  );
};

export default ResultTabs;