
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import WardrobeGrid from './components/WardrobeGrid';
import OutfitCreator from './components/OutfitCreator';
import ChatInterface from './components/ChatInterface';
import Onboarding from './components/Onboarding';
import { WardrobeProvider, useWardrobe } from './context/WardrobeContext';
import { Category, WardrobeItem } from './types';

const AppContent: React.FC<{ activeTab: string; setActiveTab: (t: string) => void }> = ({ activeTab, setActiveTab }) => {
  const { items, addItem } = useWardrobe();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Category>('shirts');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
        setIsUploading(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (uploadPreview && newItemName.trim()) {
      const newItem: WardrobeItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: newItemName,
        category: newItemCategory,
        imageUrl: uploadPreview
      };
      addItem(newItem);
      resetUpload();
      setActiveTab('wardrobe');
    }
  };

  const resetUpload = () => {
    setIsUploading(false);
    setUploadPreview(null);
    setNewItemName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onUploadClick={() => fileInputRef.current?.click()}
      >
        {renderContent()}
      </Layout>

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Global Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-indigo-900/80 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-6 w-full max-w-[340px] shadow-2xl animate-in zoom-in fade-in duration-300">
            <h3 className="text-xl font-black text-indigo-900 mb-4 text-center uppercase tracking-tight">NEW PIECE! ✨</h3>
            
            <div className="w-40 h-40 mx-auto bg-indigo-50 rounded-3xl overflow-hidden mb-6 border-4 border-indigo-100 shadow-inner">
              <img src={uploadPreview!} className="w-full h-full object-cover" alt="Preview" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-indigo-900 uppercase ml-2 mb-1 block">Item Name</label>
                <input 
                  autoFocus
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g., Favorite Blue Tee"
                  className="w-full bg-indigo-50 border-2 border-indigo-100 rounded-2xl px-4 py-3 text-sm text-black placeholder:text-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-indigo-900 uppercase ml-2 mb-1 block">Category</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {(['hats', 'shirts', 'pants', 'shoes'] as Category[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewItemCategory(cat)}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${
                        newItemCategory === cat 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105' 
                          : 'bg-white text-indigo-900 border-indigo-100 hover:border-indigo-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={resetUpload}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 font-black text-xs uppercase rounded-2xl active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!newItemName.trim()}
                  className="flex-[2] px-8 py-4 bg-emerald-500 text-white font-black text-xs uppercase rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all disabled:opacity-50 disabled:bg-emerald-300"
                >
                  Add to Closet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
