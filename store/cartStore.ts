import { create } from "zustand";
import { CartItem } from "@/types";

type CartState = {
  cart: CartItem[];
  setCartItem: (cartObj: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotalAmount: () => number;
  getTotalSavings: () => number;
};
const useCartStore = create<CartState>((set, get) => ({
    cart: [],
    setCartItem: (cartObj) => {
      set((state) => ({
        cart: [...cartObj],
      }))
    },
    addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
    removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
    updateQuantity: (id, quantity) => set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: quantity>0?quantity:1 } : item
      ),
    })),
    getTotalAmount: () => {
      const { cart } = get();
      return cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
    },
    getTotalSavings: () => {
      const { cart } = get();
      return cart.reduce((sum, item) => sum + ((item.markedPrice * item.discount) / 100) * item.quantity, 0);
    },
  // (set) => ({
  // cart: [],
  
  // updateQuantity: (id: string, change: number )=>
  //   set((state)=>{
  //     cart: [, ]
  //     state.map(item =>
  //       item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
  //     )
  //   }); 
})
);

export default useCartStore;
