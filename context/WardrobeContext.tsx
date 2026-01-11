
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { WardrobeItem, Outfit } from '../types';

interface WardrobeContextType {
  items: WardrobeItem[];
  addItem: (item: WardrobeItem) => void;
  deleteItem: (id: string) => void;
  outfits: Outfit[];
  saveOutfit: (outfit: Outfit) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export const WardrobeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WardrobeItem[]>(() => {
    try {
      const saved = localStorage.getItem('wardrobe_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load wardrobe items", e);
      return [];
    }
  });

  const [outfits, setOutfits] = useState<Outfit[]>([]);
  
  const [userName, setUserNameState] = useState<string>(() => {
    return localStorage.getItem('wardrobe_user_name') || 'Fashionista';
  });

  useEffect(() => {
    try {
      localStorage.setItem('wardrobe_items', JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save wardrobe items. Your storage might be full!", e);
      // We still update the state in-memory
    }
  }, [items]);

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem('wardrobe_user_name', name);
  };

  const addItem = (item: WardrobeItem) => {
    setItems(prev => [...prev, item]);
  };
  
  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const saveOutfit = (outfit: Outfit) => setOutfits(prev => [outfit, ...prev]);

  return (
    <WardrobeContext.Provider value={{ items, addItem, deleteItem, outfits, saveOutfit, userName, setUserName }}>
      {children}
    </WardrobeContext.Provider>
  );
};

export const useWardrobe = () => {
  const context = useContext(WardrobeContext);
  if (!context) throw new Error('useWardrobe must be used within WardrobeProvider');
  return context;
};
