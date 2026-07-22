'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  desc: string;
  veg: boolean;
  popular?: boolean;
  img: string;
  image?: string; // Support for FeaturedDishes variant
}

export interface FavoritesStore {
  items: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      addFavorite: (item) => {
        if (!get().isFavorite(item.id)) {
          set({ items: [...get().items, item] });
        }
      },
      removeFavorite: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      isFavorite: (id) => {
        return get().items.some((i) => i.id === id);
      },
      toggleFavorite: (item) => {
        if (get().isFavorite(item.id)) {
          get().removeFavorite(item.id);
        } else {
          get().addFavorite(item);
        }
      },
    }),
    {
      name: 'dilip-da-favorites',
    }
  )
);
