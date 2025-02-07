import React from 'react';
import { BarChart2, BookOpen, Home, Calculator, Brain, LineChart, Activity } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analysis', label: 'Analysis', icon: BarChart2 },
    { id: 'probability', label: 'Probability', icon: Calculator },
    { id: 'hypothesis', label: 'Hypothesis Tests', icon: Brain },
    { id: 'regression', label: 'Regression', icon: LineChart },
    { id: 'advanced', label: 'Advanced Analysis', icon: Activity },
    { id: 'tutorial', label: 'Tutorials', icon: BookOpen },
  ];

  return (
    <div className="flex items-center space-x-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};