import { create } from "zustand";

type NewOrderDetails = {
  address: string;
  orderItems: { quantity: number; addNote: string; menuId: string }[];
  scheduledOrder: boolean;
  scheduledAt: string;
  paymentMethod: "COD" | "UPI" | "Debit Card" | "Credit Card" | "Net Banking";
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

type OrdersState = {
  newOrderDetails: NewOrderDetails;
  orders: [];
  currentOrders: [];
  //   deliveryNoteModalOpen: boolean;
  //   couponsModalOpen: boolean;
  //   confirmLogoutModalOpen: boolean;
  //   paymentOptionsModal: boolean;
  setNewOrderDetails: (newOrderDetails: Partial<NewOrderDetails>) => void;
  //   setDeliveryNoteModalOpen: (open: boolean) => void;
  //   setCouponsModalOpen: (open: boolean) => void;
  //   setConfirmLogoutModalOpen: (open: boolean) => void;
  //   setPaymentOptionsModal: (open: boolean) => void;
};
const useOrderStore = create<OrdersState>((set) => ({
  newOrderDetails: {
    address: "",
    orderItems: [],
    scheduledOrder: false,
    scheduledAt: "",
    paymentMethod: "COD",
  },
  currentOrders: [],
  orders: [],
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
}));
export default useOrderStore;
