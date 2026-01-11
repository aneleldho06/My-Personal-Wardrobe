
import React, { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { Category } from '../types';

const WardrobeGrid: React.FC = () => {
  const { items, deleteItem } = useWardrobe();
  const [activeCat, setActiveCat] = useState<Category | 'all'>('all');

  const categories: (Category | 'all')[] = ['all', 'hats', 'shirts', 'pants', 'shoes'];

  const filteredItems = activeCat === 'all' ? items : items.filter(i => i.category === activeCat);

  const confirmAndDelete = (e: React.MouseEvent, id: string, name: string) => {
    // Stop the click from bubbling to the item card if any click handlers are added there later
    e.stopPropagation();
    e.preventDefault();
    
    // Using simple confirm for clarity, but optimized for mobile
    const confirmed = window.confirm(`Permanently delete your ${name}?`);
    if (confirmed) {
      deleteItem(id);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-6 min-h-[500px] border border-white/10 shadow-2xl">
      <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all uppercase tracking-widest ${
              activeCat === cat 
                ? 'bg-white text-[#0D01F5] shadow-[0_8px_20px_rgba(255,255,255,0.2)] scale-105' 
                : 'bg-white/10 text-white/50 hover:bg-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 pb-4">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-[32px] p-4 shadow-xl flex flex-col items-center group relative transition-all duration-300"
          >
            {/* ENHANCED DELETE BUTTON - Higher Visibility & Better Hit Area */}
            <div className="absolute -top-2 -right-2 z-[999]">
              <button 
                type="button"
                onClick={(e) => confirmAndDelete(e, item.id, item.name)}
                className="w-11 h-11 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(220,38,38,0.4)] border-4 border-white hover:bg-red-700 active:scale-75 transition-all cursor-pointer"
                title="Delete Item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>

            <div className="w-full aspect-square bg-indigo-50/50 rounded-[24px] overflow-hidden mb-3 border border-indigo-100/50 shadow-inner pointer-events-none">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="w-full px-1 pointer-events-none">
              <span className="block text-[11px] font-black text-indigo-950 uppercase text-center truncate tracking-tight">
                {item.name}
              </span>
              <span className="block text-[8px] font-bold text-indigo-300 uppercase text-center tracking-[0.1em] mt-0.5">
                {item.category}
              </span>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-2 py-32 text-center animate-in fade-in duration-700">
            <div className="text-4xl mb-4 opacity-20">🧥</div>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] leading-loose">
              Closet is silent...<br/>
              Time to add some flavor! ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardrobeGrid;
