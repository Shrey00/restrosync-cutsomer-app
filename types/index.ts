export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  contact: string;
  email: string;
  password?: string;
  role:
    | "customer"
    | "admin"
    | "delivery-agent"
    | "delivery"
    | "sales"
    | "packaging";
  countryCode?: string;
  address?: unknown;
  loyaltyPoints?: number;
  createdAt?: Date;
  updatedAt?: Date;
  token?: string;
}

export interface Menu {
  id: string;
  name: string;
  restaurantId: string;
  category: string;
  type: string;
  cuisineType: string;
  orders: number;
  description: string;
  rating: number;
  reviewSummary: string;
  markedPrice: number;
  sellingPrice: number;
  discount: number;
  calories: number;
  healthScore: number;
  showHealthInfo: boolean;
  variant: "add-ons" | "parent" | "child" | "none";
  images: string[];
}

export type CartItem = {
  id: string;
  name: string;
  images: string[];
  quantity: number;
  sellingPrice: number;
  cuisineType: string;
  markedPrice: number;
  discount: number;
};
export interface CartItemProps {
  id: string;
  name: string;
  cuisineType: string;
  sellingPrice: number;
  markedPrice: number;
  discount: number;
  quantity: number;
}

export interface FoodItemProps {
  id: string;
  name: string;
  images: string[];
  rating: number;
  sellingPrice: number;
  markedPrice: number;
  discount: number;
  description?: string;
  cuisineType: string;
  key?: number;
  user?: any;
  variant: string;
  setCartModalVisible?: any;
  setMenuItemData?: any;
}

export interface VariantsData {
  id: string;
  name: string;
  variantName: string;
  variant: string;
  sellingPrice: number;
  markedPrice: number;
  discount: number;
}
