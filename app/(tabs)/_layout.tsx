import { Tabs } from "expo-router";
import BottomTab from "@/components/BottomTab";
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
