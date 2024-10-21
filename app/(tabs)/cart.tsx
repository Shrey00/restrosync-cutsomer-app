import React, { useEffect, useState } from "react";
import { Platform, View, ScrollView, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import Header from "@/components/Header";
import { Text, Button } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { api } from "@/constants/api";
import useUserStore from "../../store/userStore";
import useCartStore from "../../store/cartStore";
import CartListItem from "@/components/CartListItem";
import DeliveryInfoCard from "@/components/DeliveryInfoCard";
import { CartItem } from "@/types";
export default function CartsPage() {
  const { theme } = useTheme();
  const modTheme = {
    colors: {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      background: theme.colors.background,
      white: "#FFFFFF",
      grey0: "#E0E0E0",
      grey1: "#BDBDBD",
      success: "#4CAF50",
      error: "#F44336",
    },
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: modTheme.colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: modTheme.colors.white,
      fontSize: 20,
      fontFamily: "jakarta-sans-bold",
      borderBottomWidth: 1,
      borderBottomColor: modTheme.colors.grey0,
    },
    scrollView: {
      flex: 1,
    },
    listItemContainer: {
      // borderWidth: 1,
      // borderColor: "#EF9A9A",
      padding: 12,
      marginHorizontal: 10,
      // marginTop: 20,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.008,
      shadowRadius: 4,
      elevation: 1, // For Android
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
    },
    cuisineType: {
      fontSize: 14,
      fontFamily: "jakarta-sans-light",
      color: modTheme.colors.grey1,
      marginBottom: 4,
    },
    summaryContainer: {
      backgroundColor: modTheme.colors.white,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: modTheme.colors.grey0,
    },
    divider: {
      marginBottom: 16,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 4,
    },
    summaryText: {
      fontSize: 12,
    },
    savingsAmount: {
      fontSize: 12,
      color: modTheme.colors.success,
      fontFamily: "jakarta-sans-bold",
    },
    totalAmount: {
      fontSize: 12,
      fontFamily: "jakarta-sans-bold",
    },
    checkoutButton: {
      backgroundColor: modTheme.colors.primary,
      paddingVertical: 12,
      // marginVertical: 8,
    },
    checkoutButtonTitle: {
      fontSize: 16,
    },
    checkoutButtonContainer: {
      borderRadius: 4,
      paddingVertical: 8,
    },
    couponsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    viewCouponText: {
      fontSize: 14,
    },
    paymentButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
    },
  });

  const user = useUserStore((state) => state.user);
  const cartItems = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);
  const getTotalSavings = useCartStore((state) => state.getTotalSavings);
  const setCartItem = useCartStore((state) => state.setCartItem);
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${api}/get-cart-items`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "x-platform": Platform.OS,
          },
        });
        const responseData = await response.json();
        console.log(responseData);
        setCartItem(responseData.data);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header user={user} showSearch={false} />
      <ScrollView style={styles.scrollView}>
        <View
          style={{
            paddingHorizontal: 14,
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text>🤗</Text>
          <Text
            style={{
              fontFamily: "jakarta-sans-medium",
              fontSize: 13.8,
            }}
          >
            Hii Pankaj!, you have some items in your cart.
          </Text>
        </View>
        <Card containerStyle={styles.listItemContainer}>
          {cartItems.map((item) => (
            <CartListItem
              key={item.id}
              id={item.id}
              name={item.name}
              cuisineType={item.cuisineType}
              quantity={item.quantity}
              sellingPrice={item.sellingPrice}
              markedPrice={item.markedPrice}
              discount={item.discount}
            />
          ))}
        </Card>

        <Card containerStyle={styles.listItemContainer}>
          <View style={styles.couponsContainer}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <MaterialCommunityIcons
                name="brightness-percent"
                size={19}
                color={theme.colors.primary}
              />
              <Text style={styles.viewCouponText}>View all coupons</Text>
            </View>
            <Entypo
              name="chevron-thin-right"
              size={20}
              color={theme.colors.primary}
            />
          </View>
        </Card>
        <DeliveryInfoCard />
        <Card
          containerStyle={{ ...styles.listItemContainer, marginBottom: 8 }}
        >
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total Savings</Text>
            <Text style={styles.savingsAmount}>
              ₹{getTotalSavings()?.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Taxes</Text>
            <Text style={styles.totalAmount}>₹{20}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Delivery Charges</Text>
            <Text style={styles.totalAmount}>₹{25}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total Amount</Text>
            <Text style={styles.totalAmount}>
              ₹{(getTotalAmount() + 20 + 25)?.toFixed(2)}{" "}
            </Text>
          </View>
        </Card>
      </ScrollView>
      <View style={styles.paymentButtonContainer}>
        <Button
          title="Place Order"
          titleStyle={styles.checkoutButtonTitle}
          buttonStyle={styles.checkoutButton}
          containerStyle={styles.checkoutButtonContainer}
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
}
