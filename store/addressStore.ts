import { create } from "zustand";
import { AddressType } from "@/types";
type AddressState = {
  address: AddressType;
  allAddresses: AddressType[];
  setAddress: (address: AddressType) => void;
  setAllAddresses: (address: AddressType[]) => void;
};
const useAddressStore = create<AddressState>((set, get) => ({
  address: {
    id: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    type: "",
    location: {},
    selected: true,
  },
  allAddresses: [],
  setAddress: (address) =>
    set((state) => {
      return {
        ...state,
        address: address,
      };
    }),
  setAllAddresses: (address) =>
    set((state) => {
      return {
        ...state,
        allAddresses: address,
      };
    }),
}));
export default useAddressStore;
