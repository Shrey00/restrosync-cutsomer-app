import React, { useEffect, useState } from "react";
import { Platform, View, ScrollView, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import Header from "@/components/Header";
import { Text, Button, Skeleton } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderSuccessMessage from "@/components/OrderSuccessMessage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { api } from "@/constants/api";

import CartListItem from "@/components/CartListItem";
import DeliveryInfoCard from "@/components/DeliveryInfoCard";
import ChangeAddressModal from "@/components/ChangeAddressModal";
import useUserStore from "../../store/userStore";
import useCartStore from "../../store/cartStore";
import useAddressStore from "@/store/addressStore";
import useOrderStore from "@/store/orderStore";
import { CartItem } from "@/types";
import { Link } from "expo-router";
import useModalStore from "@/store/modalsStore";
import { AddressType } from "../../types";
import { useRouter, Redirect } from "expo-router";
import { restaurantId } from "@/constants/restaurantInfo";
export default function CartsPage() {
  const { theme } = useTheme();
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
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
      padding: 12,
      marginHorizontal: 10,
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
      gap: 8,
      paddingHorizontal: 10,
    },
    skeletonContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
    },
    skeletonStructure: {
      backgroundColor: "#FFFFF",
      borderRadius: 8,
      marginVertical: 10,
    },
    skeleton: {
      backgroundColor: "#EDEDED",
    },
  });

  const paymentMethod = [
    {
      id: 1,
      name: "Pay on Delivery",
      icon: (
        <MaterialIcons
          style={{ marginRight: 4 }}
          name="delivery-dining"
          size={24}
          color={theme.colors.primary}
        />
      ),
    },
  ];
  const user: any = useUserStore((state) => state.user);
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);
  const getTotalSavings = useCartStore((state) => state.getTotalSavings);
  const setCartItem = useCartStore((state) => state.setCartItem);
  const setChangeAddressModalOpen = useModalStore(
    (state) => state.setChangeAddressModalOpen
  );
  const setAllAddresses = useAddressStore((state) => state.setAllAddresses);
  const setAddress = useAddressStore((state) => state.setAddress);
  const allAddresses = useAddressStore((state) => state.allAddresses);
  const address = useAddressStore((state) => state.address);
  const newOrderDetails = useOrderStore((state) => state.newOrderDetails);
  const setNewOrderDetails = useOrderStore((state) => state.setNewOrderDetails);
  const boolAddressSelected = (address.id ? address.id.length : 0) > 0;
  const boolHasSavedAddresses = allAddresses.length > 0;
  const [cartItemsLoading, setCartItemsLoading] = useState(false);
  const [orderButtonDisabled, setOrderButtonDisabled] = useState(true);
  const setHoverCartInfo = useCartStore((state) => state.setCartHoverInfo);
  const setHoverCardVisble = useModalStore((state) => state.setHoverCartInfo);
  if (!(user.token.length > 0)) {
    return <Redirect href={"/login"} />;
  }
  useEffect(() => {
    (async () => {
      try {
        setCartItemsLoading(true);
        const response = await fetch(`${api}/cart/get-cart-items`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const responseData = await response.json();
        setCartItem(responseData.data);
        setCartItemsLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const addressResponse = await fetch(`${api}/address/get-addresses`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const addressResponseData = await addressResponse.json();
      let selectedAddressDetail: AddressType;
      await addressResponseData.data.forEach(
        (item: AddressType, index: number) => {
          if (item.selected) {
            setAddress(item);
            selectedAddressDetail = item;
            setOrderButtonDisabled(false);
            setAllAddresses(addressResponseData.data);
            setNewOrderDetails({ address: selectedAddressDetail.id });
          }
        }
      );
    })();
  }, [cartItemsLoading]);

  const handleDeleteAllCartItems = async () => {
    const response = await fetch(`${api}/cart/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    if (response.status === 200) {
      if (cartItems.length === 1) {
        setHoverCartInfo(null, --cartItems.length);
        setHoverCardVisble(false);
      }
      setCartItem([]);
    }
  };
  const handleOrder = async () => {
    if (boolAddressSelected) {
      try {
        setLoadingPlaceOrder(true);
        const orderItems = cartItems.map((item) => {
          return {
            quantity: item.quantity,
            menuId: item.menuItemId,
            addNote: "",
          };
        });
        const createOrder = {
          ...newOrderDetails,
        };
        createOrder.orderItems = orderItems;
        const response = await fetch(`${api}/orders/place-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(createOrder),
        });
        const responseData = await response.json();
        if (responseData) {
          setOrderSuccessVisible(true);
          await handleDeleteAllCartItems();
          setCartItem([]);
          setTimeout(() => {
            setOrderSuccessVisible(false);
            // router.push("/orders/order-status")
          }, 1200);
        }
        setLoadingPlaceOrder(false);
      } catch (e) {
        setLoadingPlaceOrder(false);
        console.log(e);
      }
    } else {
      setChangeAddressModalOpen(true);
    }
  };
  const [orderSuccessVisible, setOrderSuccessVisible] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      {orderSuccessVisible ? (
        <OrderSuccessMessage />
      ) : (
        <>
          <Header user={user} showSearch={false} />
          {!cartItemsLoading ? (
            cartItems.length > 0 ? (
              <>
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
                      Hii {user.firstName}!, you have some items in your cart.
                    </Text>
                  </View>
                  <Card containerStyle={styles.listItemContainer}>
                    {cartItems.map((item, index) => (
                      <CartListItem
                        key={index}
                        menuItemId={item.menuItemId}
                        id={item.id}
                        name={item.name}
                        cuisineType={item.cuisineType}
                        quantity={item.quantity}
                        sellingPrice={item.sellingPrice}
                        markedPrice={item.markedPrice}
                        discount={item.discount}
                        restaurantId={item.restaurantId}
                      />
                    ))}
                    {cartItems.length === 0 && <View></View>}
                  </Card>
                  {/* coupons button */}
                  {/* <Card containerStyle={styles.listItemContainer}>
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
          </Card> */}
                  <DeliveryInfoCard
                    boolAddressSelected={boolAddressSelected}
                    boolHasSavedAddresses={boolHasSavedAddresses}
                  />
                  <Card
                    containerStyle={{
                      ...styles.listItemContainer,
                      marginBottom: 8,
                    }}
                  >
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryText}>Total Savings</Text>
                      <Text style={styles.savingsAmount}>
                        ₹{getTotalSavings()?.toFixed(2)}
                      </Text>
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
                    title={paymentMethod[0].name}
                    icon={paymentMethod[0].icon}
                    titleStyle={{
                      color: theme.colors.primary,
                      ...styles.checkoutButtonTitle,
                    }}
                    containerStyle={styles.checkoutButtonContainer}
                    buttonStyle={{
                      minWidth: "48%",
                      paddingVertical: 12,
                      borderWidth: 0.8,
                      borderColor: theme.colors.primary,
                      backgroundColor: "transparent",
                    }}
                  />
                  <Button
                    title="Place Order"
                    titleStyle={styles.checkoutButtonTitle}
                    loading={loadingPlaceOrder}
                    loadingStyle={{ minHeight: 24 }}
                    buttonStyle={{ minWidth: "50%", ...styles.checkoutButton }}
                    containerStyle={styles.checkoutButtonContainer}
                    disabled={orderButtonDisabled}
                    onPress={handleOrder}
                  />
                </View>
              </>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontFamily: "jarkarta-sans-medium", fontSize: 16 }}
                >
                  No items in your cart!{" "}
                  <Link
                    style={{
                      color: theme.colors.primary,
                      textDecorationLine: "underline",
                      textDecorationStyle: "solid",
                    }}
                    href="/"
                  >
                    Let's add some
                  </Link>
                </Text>
              </View>
            )
          ) : (
            <ScrollView contentContainerStyle={{ marginHorizontal: 10 }}>
              <Skeleton
                animation="pulse"
                height={45}
                style={styles.skeletonStructure}
                skeletonStyle={styles.skeleton}
              />
              <Skeleton
                animation="pulse"
                height={200}
                style={styles.skeletonStructure}
                skeletonStyle={styles.skeleton}
              />
              <Skeleton
                animation="pulse"
                height={200}
                style={styles.skeletonStructure}
                skeletonStyle={styles.skeleton}
              />
              <Skeleton
                animation="pulse"
                height={140}
                style={styles.skeletonStructure}
                skeletonStyle={styles.skeleton}
              />
            </ScrollView>
          )}
        </>
      )}

      <ChangeAddressModal />
    </SafeAreaView>
  );
}
