import React from 'react';
import { useWardrobe } from '../context/WardrobeContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onUploadClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onUploadClick }) => {
  const { userName } = useWardrobe();
  const tabs = [
    { id: 'wardrobe', label: 'Wardrobe', icon: '👕' },
    { id: 'creator', label: 'Create', icon: '✨' },
    { id: 'wizard', label: 'Wizard', icon: '🪄' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gradient-to-br from-[#0D01F5] via-[#1A0B6A] to-[#050133] overflow-hidden shadow-2xl relative">
      {/* Immersive Background Glows */}
      <div className="absolute top-[-5%] left-[-10%] w-[60%] h-[30%] bg-indigo-600/30 blur-[100px] rounded-full animate-blob pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-blob animation-delay-2000 pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center p-8 text-white shrink-0 z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-1">WardrobeWizard</span>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Ready, {userName}?</h1>
        </div>
        <div className="relative group">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} className="w-14 h-14 rounded-[22px] bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-xl transition-transform active:scale-90" alt="Profile" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#120B38]" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-40 px-6 no-scrollbar z-10">
        {children}
      </main>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-50">
        
        {/* Elevated Upload Button Container */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 group z-[70]">
          {/* Enhanced Ambient Glow */}
          <div className="absolute inset-0 bg-white/30 blur-3xl rounded-full scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 pointer-events-none" />
          
          {/* The Button */}
          <button 
            onClick={onUploadClick}
            className="relative w-20 h-20 bg-white text-[#0D01F5] rounded-[28px] flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.5)] border-4 border-[#120B38] hover:bg-[#0D01F5] hover:text-white hover:border-white hover:-translate-y-2 active:scale-90 active:translate-y-0 transition-all duration-300 z-[80] overflow-hidden cursor-pointer"
          >
            <span className="text-4xl font-black transform transition-transform duration-500 group-hover:rotate-90">+</span>
            
            {/* Inner Ring for extra flair */}
            <div className="absolute inset-1 rounded-[22px] border border-black/5 pointer-events-none" />
          </button>
          
          {/* Improved Floating Label */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] whitespace-nowrap drop-shadow-lg bg-[#0D01F5]/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
              Add New Piece
            </span>
          </div>
        </div>

        {/* Navbar */}
        <nav className="bg-white/5 backdrop-blur-3xl rounded-[40px] px-6 py-4 flex justify-between items-center shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-white/10 gap-3 relative overflow-hidden">
          {/* Subtle animated light sweep across the nav */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_5s_infinite] pointer-events-none" />
          
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 flex-1 h-16 rounded-[24px] z-10 ${
                activeTab === tab.id 
                  ? 'bg-white text-[#0D01F5] shadow-2xl scale-105' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`text-2xl ${activeTab === tab.id ? 'scale-110 mb-0.5' : ''}`}>{tab.icon}</span>
              <span className="text-[9px] font-black uppercase tracking-tighter">
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <footer className="absolute bottom-1 w-full text-center text-[7px] font-black uppercase tracking-[0.5em] text-white/10 pointer-events-none">
        Style Sustainable • 2025
      </footer>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Layout;