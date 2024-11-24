import { create } from "zustand";
import { LocationObject } from "expo-location";
type Coords = { latitude: number; longitude: number };
type LocationState = {
  location: LocationObject | undefined;
  newLocation: Coords | undefined;
  locationText: any;
  setLocation: (location: LocationObject) => void;
  setLocationText: (requiredLocationData: any) => void;
  setNewLocation: (location: { latitude: number; longitude: number }) => void;
};
const useLocationStore = create<LocationState>((set) => ({
  location: undefined,
  newLocation: undefined,
  locationText: {
    formattedAddress: "",
    areaName: "",
    subLocality: "",
    neighbourhood: "",
    city: "",
    country: "",
    state: "",
    postalCode:"",
  },
  setLocation: (location) =>
    set((state) => {
      return {
        ...state,
        ["location"]: location,
      };
    }),
  setLocationText: (requiredLocationData: any) =>
    set((state) => {
      return {
        ...state,
        ["locationText"]: requiredLocationData,
      };
    }),
  setNewLocation: (location) =>
    set((state) => {
      return {
        ...state,
        ["newLocation"]: location,
      };
    }),
}));
export default useLocationStore;
