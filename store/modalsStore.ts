import { create } from "zustand";

type ModalState = {
  changeAddressModalOpen: boolean;
  addAddressModalOpen: boolean;
  filtersModalOpen: boolean;
  addToCartModalOpen: boolean;
  //   deliveryNoteModalOpen: boolean;
  //   couponsModalOpen: boolean;
  //   confirmLogoutModalOpen: boolean;
  //   paymentOptionsModal: boolean;
  setChangeAddressModalOpen: (open: boolean) => void;
  setAddAddressModalOpen: (open: boolean) => void;
  setFiltersModalOpen: (open: boolean) => void;
  setAddToCartModalOpen: (open: boolean) => void;
  // setDeliveryNoteModalOpen: (open: boolean) => void;
  //   setCouponsModalOpen: (open: boolean) => void;
  //   setConfirmLogoutModalOpen: (open: boolean) => void;
  //   setPaymentOptionsModal: (open: boolean) => void;
};
const useModalStore = create<ModalState>((set) => ({
  changeAddressModalOpen: false,
  addAddressModalOpen: false,
  filtersModalOpen: false,
  addToCartModalOpen: false,
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
}));
export default useModalStore;
