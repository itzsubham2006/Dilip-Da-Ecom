export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  veg: boolean;
  image: string;
}

export interface CartState {
  items: CartItem[];
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
