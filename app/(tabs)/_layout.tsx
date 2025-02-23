import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Octicons from "@expo/vector-icons/Octicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { useTheme } from "@rneui/themed";
import BottomTab from "@/components/BottomTab";
import useUserStore from "@/store/userStore";
export default function TabLayout() {
  const { theme } = useTheme();
  const { token } = useUserStore((state) => state.user);
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
