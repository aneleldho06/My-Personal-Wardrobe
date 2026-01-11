
import React, { useState, useEffect, useRef } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { WardrobeItem, Category } from '../types';

const OutfitCreator: React.FC = () => {
  const { items, saveOutfit, userName } = useWardrobe();
  const [selected, setSelected] = useState<Partial<Record<Category, WardrobeItem>>>({});
  const [locked, setLocked] = useState<Record<Category, boolean>>({
    hats: false, shirts: false, pants: false, shoes: false
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const categories: Category[] = ['hats', 'shirts', 'pants', 'shoes'];

  const randomize = () => {
    const newSelected = { ...selected };
    categories.forEach(cat => {
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
        name: `Look ${new Date().toLocaleDateString()}`,
        items: selected,
        createdAt: Date.now()
      });
      setShowSuccess(true);
    }
  };

  const downloadCard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-Resolution Editorial Dimensions (9:16)
    canvas.width = 1080;
    canvas.height = 1920;

    // 1. Premium Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#0D01F5');
    bgGrad.addColorStop(1, '#050166');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Artistic Accents
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath(); ctx.arc(1080, 0, 800, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 1920, 600, 0, Math.PI * 2); ctx.fill();

    // 3. Editorial Typography
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    
    ctx.font = '900 40px "Plus Jakarta Sans"';
    ctx.fillText('WARDROBE WIZARD', canvas.width / 2, 120);
    
    ctx.font = 'italic 800 110px "Plus Jakarta Sans"';
    ctx.fillText('STYLE REPORT', canvas.width / 2, 260);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(200, 320); ctx.lineTo(880, 320); ctx.stroke();

    // 4. Center-Stacked Items
    const slotW = 500;
    const slotH = 300;
    const startY = 400;
    const spacing = 40;

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const item = selected[cat];
      const y = startY + i * (slotH + spacing);

      // Label background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.roundRect(100, y, 880, slotH, 40);
      ctx.fill();

      if (item) {
        // Draw Image
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = item.imageUrl;
        await new Promise((resolve) => {
          img.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(140, y + 20, 260, 260, 30);
            ctx.clip();
            ctx.drawImage(img, 140, y + 20, 260, 260);
            ctx.restore();
            resolve(null);
          };
          img.onerror = () => resolve(null);
        });

        // Item Text
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 32px "Plus Jakarta Sans"';
        ctx.fillText(cat.toUpperCase(), 440, y + 110);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '600 36px "Plus Jakarta Sans"';
        ctx.fillText(item.name, 440, y + 170);
      } else {
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.font = '800 30px "Plus Jakarta Sans"';
        ctx.fillText(`EMPTY ${cat.toUpperCase()}`, canvas.width / 2, y + slotH / 2 + 10);
      }
    }

    // 5. Footer "Seal"
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = '900 24px "Plus Jakarta Sans"';
    ctx.fillText('WIZARD VERIFIED • COLLECTION 2025', canvas.width / 2, 1780);
    
    ctx.font = '700 32px "Plus Jakarta Sans"';
    ctx.fillText(`PREPARED FOR ${userName.toUpperCase()}`, canvas.width / 2, 1840);

    // 6. Download
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `WardrobeWizard-Editorial-${userName.replace(/\s/g, '')}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col items-center space-y-8 pb-10">
      <canvas ref={canvasRef} className="hidden" />

      {/* Vertical Lookbook Stack */}
      <div className="w-full space-y-4 flex flex-col items-center">
        {categories.map((cat) => (
          <div key={cat} className="w-full flex items-center gap-4 bg-white/5 backdrop-blur-xl p-4 rounded-[32px] border border-white/10 group active:scale-[0.98] transition-all">
            {/* Image Slot */}
            <div className="w-24 h-24 bg-white/10 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 shadow-inner">
              {selected[cat] ? (
                <img src={selected[cat]!.imageUrl} className="w-full h-full object-cover" alt={cat} />
              ) : (
                <span className="text-[20px] opacity-20 group-hover:opacity-40 transition-opacity">
                  {cat === 'hats' ? '🧢' : cat === 'shirts' ? '👕' : cat === 'pants' ? '👖' : '👟'}
                </span>
              )}
            </div>

            {/* Info & Lock */}
            <div className="flex-1">
              <span className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">{cat}</span>
              <h3 className="text-white text-sm font-bold uppercase truncate max-w-[120px]">
                {selected[cat]?.name || 'Not selected'}
              </h3>
            </div>

            <button 
              onClick={() => setLocked(prev => ({ ...prev, [cat]: !prev[cat] }))}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all flex items-center gap-2 ${
                locked[cat] 
                  ? 'bg-yellow-400 text-[#0D01F5] shadow-[0_4px_12px_rgba(250,204,21,0.3)]' 
                  : 'bg-white/10 text-white/40 hover:bg-white/20'
              }`}
            >
              <span>{locked[cat] ? '🔒' : '🔓'}</span>
              <span>LOCK {cat.slice(0, -1)}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4 w-full">
        <button 
          onClick={randomize}
          className="flex-1 py-5 bg-emerald-500 text-white font-black text-xs uppercase rounded-[24px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-emerald-700"
        >
          <span>🎲</span> SHUFFLE LOOK
        </button>
        <button 
          onClick={handleSave}
          disabled={Object.keys(selected).length === 0}
          className="flex-1 py-5 bg-white text-[#0D01F5] font-black text-xs uppercase rounded-[24px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
        >
          <span>✨</span> SAVE STYLE
        </button>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0D01F5]/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-8 w-full max-w-[360px] shadow-2xl flex flex-col items-center text-center animate-in zoom-in slide-in-from-bottom-10">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-[28px] flex items-center justify-center text-3xl mb-6 shadow-inner animate-bounce">✓</div>
            <h2 className="text-2xl font-black text-indigo-950 mb-2 uppercase tracking-tighter italic">ICONIC LOOK!</h2>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Ready to print your editorial card?</p>

            <div className="space-y-3 w-full">
               <button 
                  onClick={downloadCard} 
                  className="w-full py-5 bg-[#0D01F5] text-white font-black text-xs uppercase rounded-[24px] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <span>📥</span> DOWNLOAD EDITORIAL CARD
               </button>
               <button 
                  onClick={() => setShowSuccess(false)} 
                  className="w-full py-5 bg-indigo-50 text-indigo-900 font-black text-xs uppercase rounded-[24px] active:scale-95 transition-all"
                >
                  KEEP STYLING
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitCreator;
