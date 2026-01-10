
import React, { useState, useEffect } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { WardrobeItem, Category } from '../types';

const OutfitCreator: React.FC = () => {
  const { items, saveOutfit } = useWardrobe();
  const [selected, setSelected] = useState<Partial<Record<Category, WardrobeItem>>>({});
  const [locked, setLocked] = useState<Record<Category, boolean>>({
    hats: false, shirts: false, pants: false, shoes: false
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [timer, setTimer] = useState(180);

  useEffect(() => {
    if (timer > 0) {
      const t = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(t);
    }
  }, [timer]);

  const randomize = () => {
    const newSelected = { ...selected };
    (['hats', 'shirts', 'pants', 'shoes'] as Category[]).forEach(cat => {
      if (!locked[cat]) {
        const catItems = items.filter(i => i.category === cat);
        if (catItems.length) {
          newSelected[cat] = catItems[Math.floor(Math.random() * catItems.length)];
        }
      }
    });
    setSelected(newSelected);
  };

  const handleSave = () => {
    if (Object.keys(selected).length > 0) {
      saveOutfit({
        id: Math.random().toString(36),
        name: `Outfit ${new Date().toLocaleDateString()}`,
        items: selected,
        createdAt: Date.now()
      });
      setShowSuccess(true);
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 relative h-full flex flex-col items-center">
      {/* Timer Bar */}
      <div className="w-full bg-white/20 rounded-full h-8 p-1 flex items-center shadow-lg backdrop-blur-md overflow-hidden">
        <div 
          className="bg-cyan-400 h-full rounded-full transition-all duration-1000 flex items-center px-4"
          style={{ width: `${(timer / 180) * 100}%` }}
        >
          <span className="text-[10px] font-black text-white whitespace-nowrap italic">
            {timer > 0 ? `GO GO! ${formatTime(timer)}` : 'TIME UP! ✨'}
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-[4/5] bg-indigo-200/40 rounded-[40px] p-6 flex flex-col items-center justify-center border border-white/20 shadow-2xl overflow-hidden">
        
        {/* Avatar Placeholder / Visual representation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
           <div className="w-16 h-16 border-2 border-white rounded-full mb-2" />
           <div className="w-32 h-48 border-2 border-white rounded-t-3xl" />
        </div>

        {/* Selected Items Visualization */}
        <div className="z-10 flex flex-col items-center gap-4">
           {['hats', 'shirts', 'pants', 'shoes'].map(cat => (
             <div key={cat} className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg overflow-hidden transition-all duration-300">
                {selected[cat as Category] ? (
                  <img src={selected[cat as Category]!.imageUrl} className="w-full h-full object-cover mix-blend-multiply" />
                ) : (
                  <span className="text-white/30 text-xs font-bold uppercase">{cat}</span>
                )}
             </div>
           ))}
        </div>

        {/* Controls Overlay */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          <div className="bg-pink-300/90 backdrop-blur-lg p-4 rounded-3xl shadow-xl border border-white/20">
             <div className="flex flex-col gap-4">
                {(['hats', 'shirts', 'pants', 'shoes'] as Category[]).map(cat => (
                  <div key={cat} className="flex items-center gap-2">
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={locked[cat]}
                          onChange={() => setLocked(prev => ({ ...prev, [cat]: !prev[cat] }))}
                        />
                        <div className="w-10 h-6 bg-white/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                     </label>
                     <span className="text-[10px] font-black text-white uppercase tracking-tighter">{cat}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <button 
          onClick={randomize}
          className="absolute left-6 bottom-6 w-16 h-16 bg-emerald-400 text-white rounded-full font-black text-[10px] uppercase shadow-lg shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-center leading-tight border-4 border-white"
        >
          Random
        </button>

        <button 
          onClick={handleSave}
          className="absolute right-6 bottom-6 px-6 py-3 bg-cyan-300 text-indigo-900 rounded-full font-black text-[10px] uppercase shadow-lg shadow-cyan-500/50 hover:scale-110 active:scale-95 transition-all border-4 border-white"
        >
          Done
        </button>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-indigo-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] p-8 w-full max-w-[320px] shadow-2xl relative overflow-hidden flex flex-col items-center">
            {/* Confetti Animation Placeholder */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner">
               ✓
            </div>
            
            <h3 className="text-xl font-black text-indigo-900 mb-6">SAVED! ✨</h3>

            <div className="flex flex-col gap-3 w-full">
               <button onClick={() => setShowSuccess(false)} className="w-full py-4 bg-cyan-200 text-cyan-900 font-black text-xs uppercase rounded-2xl active:scale-95 transition-all">Download</button>
               <button onClick={() => setShowSuccess(false)} className="w-full py-4 bg-indigo-100 text-indigo-900 font-black text-xs uppercase rounded-2xl active:scale-95 transition-all">Add to Favorites</button>
               <button onClick={() => setShowSuccess(false)} className="w-full py-4 bg-indigo-50 text-indigo-400 font-black text-xs uppercase rounded-2xl active:scale-95 transition-all">Exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitCreator;
