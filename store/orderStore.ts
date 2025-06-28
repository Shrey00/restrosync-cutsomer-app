import { create } from "zustand";
import { Coupon } from "../types";
type OrderItems = {
  quantity: number;
  menuId: string;
  addOns?: {
    id: string;
    name: string;
    sellingPrice: number;
  }[];
}[];
type NewOrderDetails = {
  address: string;
  orderItems: OrderItems;
  scheduledOrder: boolean;
  scheduledAt: string;
  paymentMethod: "COD" | "UPI" | "Debit Card" | "Credit Card" | "Net Banking";
  couponApplied?: Coupon;
  deliveryNote: string;
};

type OrderDetails = {
  orderId: string;
  customerId: string;
  taxes: number;
  deliveryCharges: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  scheduledAt: string | Date;
  address: string;
};

type OrderItem = {
  name: string;
  cuisineType: "veg" | "non-veg";
  status: string;
  quantity: number;
  amount: number;
};
type Order = {
  orderId: string;
  totalAmount: number;
  deliveryStatus: string;
  restaurantName: string;
  discount: number;
  createdAt: string | Date;
  orderItems: OrderItem[];
};
type Orders = Order[];
type Filter = { filter: string; value: string };

type OrdersState = {
  newOrderDetails: NewOrderDetails;
  orders: Orders;
  currentOrders: [];
  appliedFilters: Filter[];
  deliveryNote: string;
  //   deliveryNoteModalOpen: boolean;
  //   couponsModalOpen: boolean;
  //   confirmLogoutModalOpen: boolean;
  //   paymentOptionsModal: boolean;
  addFilter: (filters: Filter[]) => void;
  removeFilter: (filter: Filter) => void;
  clearAllFilters: () => void;
  setNewOrderDetails: (newOrderDetails: Partial<NewOrderDetails>) => void;
  setOrders: (orders: Orders) => void;
  getOrder: (orderId: string) => Order | undefined;
  getCurrentOrders: () => Orders;
  setDeliveryNote: (note: string) => void;
  // setDeliveryNoteModalOpen: (open: boolean) => void;
  //   setCouponsModalOpen: (open: boolean) => void;
  //   setConfirmLogoutModalOpen: (open: boolean) => void;
  //   setPaymentOptionsModal: (open: boolean) => void;
};
const useOrderStore = create<OrdersState>((set, get) => ({
  newOrderDetails: {
    address: "",
    orderItems: [],
    scheduledOrder: false,
    scheduledAt: "",
    paymentMethod: "COD",
    deliveryNote: "",
  },
  currentOrders: [],
  deliveryNote: "",
  orders: [],
  appliedFilters: [],
  addFilter: (filters) =>
    set((state) => ({
      ...state,
      appliedFilters: [...filters],
    })),
  removeFilter: (filter) =>
    set((state) => ({
      ...state,
      appliedFilters: state.appliedFilters.filter(
        (appliedFilter) => appliedFilter.filter !== filter.filter
      ),
    })),
  clearAllFilters: () =>
    set((state) => ({
      ...state,
      appliedFilters: [],
    })),
  setNewOrderDetails: (orderDetail) => {
    set((state) => {
      return {
        ...state,
        newOrderDetails: {
          ...state.newOrderDetails,
          ...orderDetail,
        },
      };
    });
  },
  setOrders: (orders) => {
    set((state) => {
      return {
        ...state,
        orders: [...orders],
      };
    });
  },
  setDeliveryNote: (note) => {
    set((state) => {
      return {
        ...state,
        deliveryNote: note,
      };
    });
  },
  getOrder: (orderId) => {
    const { orders } = get();
    return orders.find((orderItem) => orderItem.orderId === orderId);
  },
  getCurrentOrders: () => {
    const { orders } = get();
    const currentOrders = orders.filter((order) => {
      return (
        order.deliveryStatus !== "Delivered" &&
        order.deliveryStatus !== "Cancelled"
      );
    });
    return currentOrders;
  },
}));
export default useOrderStore;
