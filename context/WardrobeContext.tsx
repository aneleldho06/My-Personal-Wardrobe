
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WardrobeItem, Outfit } from '../types';

interface WardrobeContextType {
  items: WardrobeItem[];
  addItem: (item: WardrobeItem) => void;
  outfits: Outfit[];
  saveOutfit: (outfit: Outfit) => void;
}

const INITIAL_ITEMS: WardrobeItem[] = [];

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export const WardrobeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WardrobeItem[]>(INITIAL_ITEMS);
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  const addItem = (item: WardrobeItem) => setItems(prev => [...prev, item]);
  const saveOutfit = (outfit: Outfit) => setOutfits(prev => [outfit, ...prev]);

  return (
    <div className="contents">
      <WardrobeContext.Provider value={{ items, addItem, outfits, saveOutfit }}>
        {children}
      </WardrobeContext.Provider>
    </div>
  );
};

export const useWardrobe = () => {
  const context = useContext(WardrobeContext);
  if (!context) throw new Error('useWardrobe must be used within WardrobeProvider');
  return context;
};
