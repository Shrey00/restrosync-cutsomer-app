import { create } from "zustand";
import { CartItem, Coupon, FoodItemProps } from "@/types";
type CartHoverInfo = {
  item: CartItem | null;
  itemCount: number;
};

type CartState = {
  cart: CartItem[];
  cartHoverInfo: CartHoverInfo;
  coupons: Coupon[];
  appliedCoupon: Coupon | null | undefined;
  couponDiscountAmount: number;
  selectedMenuItemData: FoodItemProps;
  setCartItem: (fullCartArr: CartItem[]) => void;
  setCoupons: (coupons: Coupon[]) => void;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  setSelectedMenuItemData: (data: FoodItemProps) => void;
  addToCart: (item: CartItem) => void;
  setCartHoverInfo: (item: CartItem | null, count: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getDiscountAmount: (totalAmount: number) => number;
  setDiscountAmount: (amount: number) => void;
  getTotalAmount: () => {
    totalAmount: number;
    discountAmount: number;
    payableAmount: number;
  };
  getTotalSavings: () => number;
};
const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  coupons: [],
  selectedMenuItemData: {
    id: "",
    name: "",
    images: [],
    rating: 0,
    sellingPrice: 0,
    markedPrice: 0,
    discount: 0,
    cuisineType: "",
    variant: "",
    restaurantId: "",
  },
  appliedCoupon: null,
  couponDiscountAmount: 0,
  cartHoverInfo: {
    item: null,
    itemCount: 0,
  },
  setCartItem: (fullCartArr) => {
    set((state) => ({
      ...state,
      cart: [...fullCartArr],
    }));
  },
  setCartHoverInfo: (cartObj, count) => {
    set((state) => ({
      ...state,
      cartHoverInfo: {
        item: cartObj,
        itemCount: count,
      },
    }));
  },
  addToCart: (item) =>
    set((state) => ({ ...state, cart: [...state.cart, item] })),
  removeFromCart: (id) =>
    set((state) => ({
      ...state,
      cart: state.cart.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      ...state,
      cart: state.cart.map((item) =>
        item.id === id
          ? { ...item, quantity: quantity > 0 ? quantity : 1 }
          : item
      ),
    })),
  setDiscountAmount: (amount: number) =>
    set((state) => ({
      ...state,
      couponDiscountAmount: amount,
    })),
  getDiscountAmount: (totalAmount: number) => {
    const { appliedCoupon } = get();
    if (appliedCoupon && totalAmount >= appliedCoupon.minOrderValue) {
      const discountAmount = (totalAmount * appliedCoupon.discount) / 100;
      if (discountAmount <= appliedCoupon.maxDiscountAmount) {
        return discountAmount!;
      } else if (discountAmount > appliedCoupon.maxDiscountAmount) {
        return appliedCoupon.maxDiscountAmount!;
      }
    }
    return 0;
  },
  getTotalAmount: () => {
    const { cart, getDiscountAmount } = get();
    let totalAmount = 0;
    cart?.forEach((item) => {
      let addOnAmount = 0;
      let itemAmount = item.sellingPrice * item.quantity;
      item?.addOns?.forEach((addOn: any) => {
        addOnAmount += addOn.sellingPrice * item.quantity;
      });
      totalAmount += itemAmount + addOnAmount;
    });
    const discountAmount = getDiscountAmount(totalAmount);
    return {
      totalAmount,
      discountAmount,
      payableAmount: totalAmount - discountAmount,
    };
  },
  getTotalSavings: () => {
    const { cart } = get();
    return cart.reduce(
      (sum, item) =>
        sum + (item.markedPrice - item.sellingPrice) * item.quantity,
      0
    );
  },
  setCoupons: (coupons) =>
    set((state) => ({
      ...state,
      coupons: coupons,
    })),
  setAppliedCoupon: (coupon) => {
    const { getTotalAmount } = get();
    if (coupon && getTotalAmount().totalAmount > coupon.minOrderValue) {
      return set((state) => ({
        ...state,
        appliedCoupon: coupon,
      }));
    } else if (coupon === null) {
      return set((state) => ({
        ...state,
        appliedCoupon: coupon,
      }));
    } else {
      return set((state) => ({
        ...state,
        appliedCoupon: undefined,
      }));
    }
  },
  setSelectedMenuItemData: (data) =>
    set((state) => ({
      ...state,
      selectedMenuItemData: data,
    })),
}));

export default useCartStore;
