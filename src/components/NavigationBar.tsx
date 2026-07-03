import React from 'react';
import { Shield, BarChart3, Calculator, ClipboardList, Scale } from 'lucide-react';

export type AppView = 'governance' | 'risk_dimensions' | 'materiality' | 'inventory' | 'feat';

interface NavigationBarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const NAV_TABS: { view: AppView; label: string; icon: React.ReactNode; isMindForge: boolean }[] = [
  { view: 'governance', label: 'Governance Playground', icon: <Shield size={16} />, isMindForge: false },
  { view: 'risk_dimensions', label: 'Risk Dimensions', icon: <BarChart3 size={16} />, isMindForge: true },
  { view: 'materiality', label: 'Risk Materiality', icon: <Calculator size={16} />, isMindForge: true },
  { view: 'inventory', label: 'System Inventory', icon: <ClipboardList size={16} />, isMindForge: true },
  { view: 'feat', label: 'FEAT Alignment', icon: <Scale size={16} />, isMindForge: true },
];

export default function NavigationBar({ activeView, onViewChange }: NavigationBarProps) {
  return (
    <div className="nav-bar">
      <div className="flex items-center gap-4 mr-6">
        <div className="p-1.5 bg-indigo-600 rounded-lg">
          <Shield size={18} className="text-white" />
        </div>
        <span className="text-sm font-black text-white tracking-tight whitespace-nowrap">SAFR</span>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto">
        {NAV_TABS.map(tab => (
          <button
            key={tab.view}
            onClick={() => onViewChange(tab.view)}
            className={`nav-tab ${activeView === tab.view ? 'nav-tab-active' : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.isMindForge && (
              <span className="nav-mindforge-badge">MindForge</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
