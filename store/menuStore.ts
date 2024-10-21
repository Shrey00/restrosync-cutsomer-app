import { create } from "zustand";
import { Menu } from "@/types";

type MenuState = {
  menu: Menu[];
  setMenu: (menuObj: Menu[]) => void;
};
const useMenuStore = create<MenuState>((set) => ({
  menu: [],
  setMenu: (menuObj) =>
    set((state) => ({
      menu: [...menuObj],
    })),
}));
export default useMenuStore;
