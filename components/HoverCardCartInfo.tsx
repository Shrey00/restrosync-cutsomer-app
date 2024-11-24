import { View, Text, Animated, StyleSheet } from "react-native";
import React, { useRef } from "react";
import { Card, Button, useTheme } from "@rneui/themed";
import useCartStore from "@/store/cartStore";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
const HoverCardCartInfo = ({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: any;
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current; // Initial position of modal (offscreen)
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300, // Slide back down
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const { theme } = useTheme();
  const styles = StyleSheet.create({
    mainContainer: {
      margin: 16,
      position: "absolute",
      padding: 12,
      marginHorizontal: 10,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.008,
      shadowRadius: 4,
      elevation: 1,
      backgroundColor: "#FEFEFE",
      bottom: 0,
      left: 0,
      right: 0,
      borderWidth: 0.8,
      borderColor: theme.colors.primary,
    },
  });
  if (isVisible) {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to view
      duration: 120,
      useNativeDriver: true,
    }).start();
  } else {
    closeModal();
  }
  const router = useRouter();
  const cartHoverInfo = useCartStore((state) => state.cartHoverInfo);
  return (
    <Animated.View
      style={{
        ...styles.mainContainer,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {/* <Animated.View style={[{ transform: [{ translateY: slideAnim }] }]}> */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <View style={{flexDirection:"row", gap:4, alignItems:"center"}}>
            <AntDesign name="shoppingcart" size={20} color={theme.colors.primary} />
            <Text style={{ fontFamily: "jakarta-sans-semibold" }}>
              {cartHoverInfo.item?.name}
            </Text>
          </View>
          {cartHoverInfo.itemCount > 1 && (
            <Text
              style={{
                fontFamily: "jakarta-sans-medium",
                fontSize: 12,
                width: "90%",
              }}
            >
              and {cartHoverInfo.itemCount - 1} other items are in the cart.
            </Text>
          )}
        </View>
        <Button
          title="Go to Cart"
          onPress={() => {
            router.push("/cart");
          }}
        />
      </View>
    </Animated.View>
  );
};

export default HoverCardCartInfo;
