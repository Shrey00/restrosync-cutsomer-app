import { create } from "zustand";
import { Menu } from "@/types";

type Filter = { filter: string; value: string };
type MenuState = {
  menu: Menu[];
  appliedFilters: Filter[];
  setMenu: (menuObj: Menu[]) => void;
  addFilter: (filters: Filter[]) => void;
  removeFilter: (filter: Filter) => void;
  clearAllFilters: () => void;
};
const useMenuStore = create<MenuState>((set) => ({
  menu: [],
  appliedFilters: [],
  setMenu: (menuObj) =>
    set((state) => ({
      ...state,
      menu: [...menuObj],
    })),
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
}));

export default useMenuStore;
