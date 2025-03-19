import { Tabs } from "expo-router";
import { useTheme } from "@rneui/themed";
import BottomTab from "@/components/BottomTab";
import useUserStore from "@/store/userStore";
export default function TabLayout() {
  return (
    <Tabs tabBar={BottomTab}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
