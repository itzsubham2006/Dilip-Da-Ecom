export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  veg: boolean;
  image: string;
  restaurantSlug: string;
  restaurantName: string;
}

export interface CartState {
  items: CartItem[];
  restaurantSlug: string | null;
  restaurantName: string | null;
}

export interface CartStore extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  deliveryFee: () => number;
  taxAmount: () => number;
  total: () => number;
}
