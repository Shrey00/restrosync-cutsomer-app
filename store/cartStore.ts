import { create } from "zustand";
import { CartItem } from "@/types";

type CartHoverInfo = {
  item: CartItem | null,
  itemCount: number,
}
type CartState = {
  cart: CartItem[];
  cartHoverInfo: CartHoverInfo,
  setCartItem: (fullCartArr: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  setCartHoverInfo: (item: CartItem | null, count: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotalAmount: () => number;
  getTotalSavings: () => number;
};
const useCartStore = create<CartState>((set, get) => ({
    cart: [],
    cartHoverInfo: {
      item: null,
      itemCount:0,
    },
    setCartItem: (fullCartArr) => {
      set((state) => ({
        ...state,
        cart: [...fullCartArr],
      }))
      
    },
    setCartHoverInfo: (cartObj, count) => {
      set((state) => ({
        ...state,
        cartHoverInfo: {
          item: cartObj,
          itemCount: count
        }
      }))
    },
    addToCart: (item) => set((state) => ({...state, cart: [...state.cart, item] })),
    removeFromCart: (id) => set((state) => ({...state, cart: state.cart.filter((item) => item.id !== id) })),
    updateQuantity: (id, quantity) => set((state) => ({
      ...state,      
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
      return cart.reduce((sum, item) => sum + (item.markedPrice - item.sellingPrice) * item.quantity, 0);
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
