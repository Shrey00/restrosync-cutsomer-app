import { create } from "zustand";

type ModalState = {
  changeAddressModalOpen: boolean;
  addAddressModalOpen: boolean;
  filtersModalOpen: boolean;
  addToCartModalOpen: boolean;
  hoverCartInfo: boolean;
  hoverOrderInfo: boolean;
  addNoteModalOpen: boolean;
  couponsModalOpen: boolean;
  //   confirmLogoutModalOpen: boolean;
  //   paymentOptionsModal: boolean;
  setChangeAddressModalOpen: (open: boolean) => void;
  setAddAddressModalOpen: (open: boolean) => void;
  setFiltersModalOpen: (open: boolean) => void;
  setAddToCartModalOpen: (open: boolean) => void;
  setHoverCartInfo: (open: boolean) => void;
  setHoverOrderInfo: (open: boolean) => void;
  setAddNoteModalOpen: (open: boolean) => void;
  setCouponsModalOpen: (open: boolean) => void;
  //   setConfirmLogoutModalOpen: (open: boolean) => void;
  //   setPaymentOptionsModal: (open: boolean) => void;
};
const useModalStore = create<ModalState>((set) => ({
  changeAddressModalOpen: false,
  addAddressModalOpen: false,
  filtersModalOpen: false,
  couponsModalOpen: false,
  addToCartModalOpen: false,
  addNoteModalOpen: false,
  hoverCartInfo: false,
  hoverOrderInfo: false,
  setChangeAddressModalOpen: (open) =>
    set((state) => {
      return {
        ...state,
        changeAddressModalOpen: open,
      };
    }),
  setAddAddressModalOpen: (open) =>
    set((state) => {
      return {
        ...state,
        addAddressModalOpen: open,
      };
    }),
  setFiltersModalOpen: (open) =>
    set((state) => {
      return {
        ...state,
        filtersModalOpen: open,
      };
    }),
  setAddToCartModalOpen: (open) =>
    set((state) => {
      return {
        ...state,
        addToCartModalOpen: open,
      };
    }),
  setHoverCartInfo: (open) =>
    set((state) => {
      return {
        ...state,
        hoverCartInfo: open,
      };
    }),
  setHoverOrderInfo: (open) =>
    set((state) => {
      return {
        ...state,
        hoverOrderInfo: open,
      };
    }),
  setCouponsModalOpen: (open) =>
    set((state) => {
      return {
        ...state,
        couponsModalOpen: open,
      };
    }),
  setAddNoteModalOpen: (open) =>
    set((state) => {
      return {
        ...state,
        addNoteModalOpen: open,
      };
    }),
}));
export default useModalStore;
