import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import AntDesign from "@expo/vector-icons/AntDesign";
const BottomTab: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  // const { theme } = useTheme();
  const theme = {
    colors: {
      primary: "#EF5350",
      grey2: "grey",
    },
  };
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: string =
          options.tabBarLabel !== undefined
            ? String(options.tabBarLabel)
            : options.title !== undefined
            ? String(options.title)
            : route.name;

        const isFocused = state.index === index;

        const icons: { [key: string]: (color: string) => JSX.Element } = {
          index: (color: string) => (
            <AntDesign name="home" size={20} color={color} />
          ),
          profile: (color: string) => (
            <AntDesign name="user" size={20} color={color} />
          ),
          search: (color: string) => (
            <AntDesign name="search1" size={20} color={color} />
          ),
          menu: (color: string) => (
            <AntDesign name="profile" size={20} color={color} />
          ),
          cart: (color: string) => (
            <AntDesign name="shoppingcart" size={20} color={color} />
          ),
        };

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            {icons[route.name](
              isFocused ? theme.colors.primary : theme.colors.grey2
            )}
            <Text
              style={{
                color: isFocused ? theme.colors.primary : theme.colors.grey2,
                textAlign: "center",
                fontFamily: "jakarta-sans-medium"
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: "#FFFDFE",
    // // flex: 1,
    flexDirection: "row",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8
  },
});
export default BottomTab;
