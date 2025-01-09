import { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Icon } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { Card, Image, Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import useUserStore from "@/store/userStore";
import OrderItemDropdown from "@/components/OrderItemDropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import FoodItemCard from "@/components/FoodItemCard";
import VegIcon from "../assets/veg-icon.svg";
import NonVegIcon from "../assets/non-veg-icon.svg";
import Feather from "@expo/vector-icons/Feather";
import { api } from "../constants/api";
import useOrderStore from "@/store/orderStore";
import { ScrollView } from "react-native";
const stages = [
  { id: 1, name: "Order Confirmed", icon: "check-circle", reached: true },
  { id: 2, name: "Cooking", icon: "utensils", reached: true },
  { id: 3, name: "Order Picked Up", icon: "truck", reached: true },
  { id: 4, name: "Out for Delivery", icon: "map-marker-alt", reached: true },
  { id: 5, name: "Delivered", icon: "home", reached: false },
];

const OrderStatus = () => {
  const { theme } = useTheme();

  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setOrders = useOrderStore((state) => state.setOrders);
  const orders = useOrderStore((state) => state.orders);
  const styles = StyleSheet.create({
    card: {
      borderRadius: 10,
      padding: 14,
      margin: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 0.4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 1,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    stageContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    iconContainer: {
      alignItems: "center",
      marginRight: 10,
    },
    circle: {
      width: 60,
      height: 60,
      borderRadius: 60,
      borderWidth: 3,
      justifyContent: "center",
      alignItems: "center",
    },
    line: {
      width: 3,
      height: 40,
    },
    stageText: {
      fontSize: 16,
      fontFamily: "jakarta-sans-medium",
      color: "#333",
      marginTop: 14,
    },
    fontStyles: {
      color: theme.colors.grey1,
      fontFamily: "jakarta-sans-medium",
      fontSize: 14,
    },
    orderItemsContainerBorder: {
      borderBottomWidth: 0.4,
      borderColor: theme.colors.grey2,
      paddingBottom: 12,
    },
    flexRowContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });

  const cuisineType = "veg";
  useEffect(() => {
    (async () => {
      const response = await fetch(`${api}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setOrders(data);
    })();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Pressable
        style={{ marginLeft: 12, flexDirection: "row", alignItems: "center" }}
        onPress={() => {
          router.replace("/profile");
        }}
      >
        <Entypo
          name="chevron-thin-left"
          size={24}
          color={theme.colors.primary}
        />
        <Text
          style={{
            fontFamily: "jakarta-sans-medium",
            fontSize: 20,
            color: theme.colors.primary,
            marginBottom: 4,
            marginLeft: 2,
          }}
        >
          Profile
        </Text>
      </Pressable>
      {orders.length > 0 ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
          {orders?.map((order, orderIndex) => {
            return (
              <Pressable
                key={orderIndex}
                onPress={() =>
                  router.push(`/order-details?orderId=${order.orderId}`)
                }
              >
                <Card containerStyle={styles.card}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "jakarta-sans-semibold",
                        fontSize: 16,
                      }}
                    >
                      {order.restaurantName}
                    </Text>
                    <OrderItemDropdown id={order.orderId} />
                  </View>
                  <View style={styles.orderItemsContainerBorder}>
                    <Text
                      style={{
                        ...styles.fontStyles,
                        color: theme.colors.grey0,
                        marginBottom: 6,
                      }}
                    >
                      {order.orderId}
                    </Text>
                    {order.orderItems?.map((orderItem, orderItemIndex) => {
                      return (
                        <View
                          style={styles.flexRowContainer}
                          key={orderItemIndex}
                        >
                          <Text style={styles.fontStyles}>
                            {orderItem.cuisineType === "veg" ? (
                              <VegIcon width={14} height={14} />
                            ) : (
                              <NonVegIcon width={18} height={18} />
                            )}
                            {"  "}
                            {orderItem.quantity} x {orderItem.name}
                          </Text>
                          <Text style={styles.fontStyles}>
                            ₹{orderItem.amount}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  <View style={styles.flexRowContainer}>
                    <Text style={styles.fontStyles}>Grand Total</Text>
                    <Text style={styles.fontStyles}>₹{order.totalAmount}</Text>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: "jarkarta-sans-medium", fontSize: 16 }}>
            Haven't ordered yet!{" "}
            <Link
              style={{
                color: theme.colors.primary,
                textDecorationLine: "underline",
                textDecorationStyle: "solid",
              }}
              href="/"
            >
              Let's order
            </Link>
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrderStatus;
