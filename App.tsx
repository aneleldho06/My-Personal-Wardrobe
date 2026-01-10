
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import WardrobeGrid from './components/WardrobeGrid';
import OutfitCreator from './components/OutfitCreator';
import ChatInterface from './components/ChatInterface';
import Onboarding from './components/Onboarding';
import { WardrobeProvider, useWardrobe } from './context/WardrobeContext';

const AppContent: React.FC<{ activeTab: string; setActiveTab: (t: string) => void }> = ({ activeTab, setActiveTab }) => {
  const { items } = useWardrobe();

  const renderContent = () => {
    switch (activeTab) {
      case 'wardrobe':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="mb-6">
                <h2 className="text-white text-lg font-black uppercase tracking-widest flex items-center gap-3">
                  <span className="text-2xl">🧺</span> My Wardrobe
                </h2>
                <p className="text-white/60 text-[10px] font-bold">{items.length} ITEMS TOTAL • ECO-FRIENDLY REUSE</p>
             </div>
             <WardrobeGrid />
          </div>
        );
      case 'creator':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-white text-lg font-black uppercase tracking-widest flex items-center gap-3">
                    <span className="text-2xl">🎨</span> Design
                  </h2>
                </div>
             </div>
             <OutfitCreator />
          </div>
        );
      case 'wizard':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="mb-6">
                <h2 className="text-white text-lg font-black uppercase tracking-widest flex items-center gap-3">
                  <span className="text-2xl">🪄</span> Wizard AI
                </h2>
                <p className="text-white/60 text-[10px] font-bold">STYLING FROM YOUR CLOSET ONLY</p>
             </div>
             <ChatInterface />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('wardrobe');
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const onboarded = localStorage.getItem('wardrobe_onboarded');
    setShowOnboarding(!onboarded);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('wardrobe_onboarded', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding === null) return null;

  return (
    <WardrobeProvider>
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
      <AppContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </WardrobeProvider>
  );
};

export default App;
