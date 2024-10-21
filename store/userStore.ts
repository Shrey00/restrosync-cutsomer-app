import { create } from "zustand";
import { User } from "@/types";
// const userStore = create((set) => ({
//   user: null,
//   signin: ()=>{},
//   redirectOrPromptToSignInorSignUp: () => {},
//   ifSelectedAddButtonRedirectToLogin: () => {},
//   updateUserDetailsMaybeAddress: () => {},
// }));

interface UserState {
  user: User;
  setUser: (userObj: User) => void;
  redirectOrPromptToSignInorSignUp: () => void;
  ifSelectedAddButtonRedirectToLogin: () => void;
  updateUserDetailsMaybeAddress: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: {
    id: "",
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    role: "customer",
    countryCode: "",
    address: {},
    loyaltyPoints: 0,
    token: "",
  },
  setUser: (userObj) =>
    set((state) => ({
      user: {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        contact: userObj.contact,
        email: userObj.email,
        role: userObj.role,
        countryCode: userObj.countryCode,
        loyaltyPoints: userObj.loyaltyPoints,
        token: userObj.token,
      },
    })),
  redirectOrPromptToSignInorSignUp: () => {},
  ifSelectedAddButtonRedirectToLogin: () => {},
  updateUserDetailsMaybeAddress: () => {},
}));

export default useUserStore;