
import React, { useState, useRef } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { Category, WardrobeItem } from '../types';

const WardrobeGrid: React.FC = () => {
  const { items, addItem } = useWardrobe();
  const [activeCat, setActiveCat] = useState<Category | 'all'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Category>('shirts');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categories: (Category | 'all')[] = ['all', 'hats', 'shirts', 'pants', 'shoes'];

  const filteredItems = activeCat === 'all' ? items : items.filter(i => i.category === activeCat);

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
    }
  };

  const resetUpload = () => {
    setIsUploading(false);
    setUploadPreview(null);
    setNewItemName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 min-h-[500px] border border-white/10 shadow-inner">
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCat === cat 
                ? 'bg-indigo-500 text-white shadow-lg' 
                : 'bg-white/20 text-white/70 hover:bg-white/30'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center group relative active:scale-95 transition-transform overflow-hidden">
            <div className="w-full aspect-square bg-indigo-50 rounded-xl overflow-hidden mb-2">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase text-center truncate w-full px-1">
              {item.name}
            </span>
          </div>
        ))}
        
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-orange-200/80 rounded-2xl p-3 border-2 border-dashed border-orange-400 flex flex-col items-center justify-center min-h-[140px] text-orange-700 active:scale-95 transition-transform"
        >
           <span className="text-2xl mb-1">📸</span>
           <span className="text-[10px] font-bold">ADD CLOTHES</span>
        </button>
      </div>

      {/* Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-indigo-900/80 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-6 w-full max-w-[340px] shadow-2xl animate-in zoom-in fade-in duration-300">
            <h3 className="text-xl font-black text-indigo-900 mb-4 text-center">NEW PIECE! ✨</h3>
            
            <div className="w-40 h-40 mx-auto bg-indigo-50 rounded-3xl overflow-hidden mb-6 border-4 border-indigo-100">
              <img src={uploadPreview!} className="w-full h-full object-cover" alt="Preview" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Item Name</label>
                <input 
                  autoFocus
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g., Favorite Blue Tee"
                  className="w-full bg-indigo-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Category</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {(['hats', 'shirts', 'pants', 'shoes'] as Category[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewItemCategory(cat)}
                      className={`py-2 rounded-xl text-[10px] font-bold uppercase border-2 transition-all ${
                        newItemCategory === cat 
                          ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' 
                          : 'bg-white text-indigo-300 border-indigo-100 hover:border-indigo-200'
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
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-xs uppercase rounded-2xl active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!newItemName.trim()}
                  className="flex-2 px-8 py-4 bg-emerald-400 text-white font-black text-xs uppercase rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all disabled:opacity-50"
                >
                  Add to Closet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardrobeGrid;
