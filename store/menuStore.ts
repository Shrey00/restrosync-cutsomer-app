import { create } from "zustand";
import { Menu, MenuItem } from "@/types";

type Filter = { filter: string; value: string };
type MenuState = {
  menu: Menu[];
  appliedFilters: Filter[];
  setMenu: (menuObj: Menu[]) => void;
  getMenuItem: (id: string) => MenuItem | null;
  addFilter: (filters: Filter[]) => void;
  removeFilter: (filter: Filter) => void;
  clearAllFilters: () => void;
};
const useMenuStore = create<MenuState>((set, get) => ({
  menu: [],
  appliedFilters: [],
  setMenu: (menuObj) =>
    set((state) => ({
      ...state,
      menu: [...menuObj],
    })),
  getMenuItem: (id) => {
    const { menu } = get();
    for (let i = 0; i < menu.length; ++i) {
      const item = menu[i].items.find((menuItem) => menuItem.id === id);
      if (item) return item;
    }
    return null;
  },
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
