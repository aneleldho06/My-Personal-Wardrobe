
export type Category = 'hats' | 'shirts' | 'pants' | 'shoes';

export interface WardrobeItem {
  id: string;
  name: string;
  category: Category;
  imageUrl: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: {
    hats?: WardrobeItem;
    shirts?: WardrobeItem;
    pants?: WardrobeItem;
    shoes?: WardrobeItem;
  };
  createdAt: number;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}
