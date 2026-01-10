
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'wardrobe', label: 'Wardrobe', icon: '👕' },
    { id: 'creator', label: 'Create', icon: '✨' },
    { id: 'wizard', label: 'Wizard', icon: '🪄' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-indigo-50/5 overflow-hidden shadow-2xl relative">
      {/* Header */}
      <header className="flex justify-between items-center p-6 text-white shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Wardrobe</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium opacity-90">Amber</span>
          <img src="https://picsum.photos/seed/amber/100/100" className="w-10 h-10 rounded-full border-2 border-white/50" alt="Profile" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] bg-white/90 backdrop-blur-md rounded-full px-6 py-4 flex justify-between items-center shadow-xl border border-white/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === tab.id ? 'text-indigo-600 scale-110' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </nav>

      <footer className="absolute bottom-1 w-full text-center text-[8px] text-white/40 pointer-events-none">
        Wardrobe Team 2025 — All Rights Reserved
      </footer>
    </div>
  );
};

export default Layout;
