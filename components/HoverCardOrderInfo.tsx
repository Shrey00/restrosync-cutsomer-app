import { View, Text, Animated, StyleSheet } from "react-native";
import React, { useRef } from "react";
import { Button, useTheme } from "@rneui/themed";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import useOrderStore from "@/store/orderStore";
const HoverCardOrderInfo = ({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: any;
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current; // Initial position of modal (offscreen)
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
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
      toValue: 8, // Slide to view
      duration: 120,
      useNativeDriver: true,
    }).start();
  } else {
    closeModal();
  }
  const router = useRouter();
  const getCurrentOrders = useOrderStore((state) => state.getCurrentOrders);
  const currentOrders = getCurrentOrders();
  return (
    currentOrders && (
      <Animated.View
        style={{
          ...styles.mainContainer,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: "jakarta-sans-semibold",
                width: 200,
              }}
            >
              {currentOrders[0]?.orderItems[0]?.name}
            </Text>
            {(currentOrders[0]?.orderItems.length > 0 ||
              currentOrders.length > 0) && (
              <Text
                style={{
                  fontFamily: "jakarta-sans-medium",
                  fontSize: 11.8,
                }}
              >
                and other items
              </Text>
            )}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button
              title="Order Status"
              onPress={() => {
                router.push(
                  `/order-status?orderId=${currentOrders[0]?.orderId}`
                );
              }}
            />
            <Pressable onPress={() => setIsVisible(false)}>
              <AntDesign
                name="close"
                size={22}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    )
  );
};

export default HoverCardOrderInfo;
