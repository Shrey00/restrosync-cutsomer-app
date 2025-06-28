import { useEffect, useState, createRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme, Skeleton, Badge } from "@rneui/themed";
import { Card, Input } from "@rneui/themed";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import useUserStore from "@/store/userStore";
import OrderItemDropdown from "@/components/OrderItemDropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import VegIcon from "../assets/veg-icon.svg";
import NonVegIcon from "../assets/non-veg-icon.svg";
import { api } from "../constants/api";
import useOrderStore from "@/store/orderStore";
import { ScrollView, TextInput } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const Orders = () => {
  const { theme } = useTheme();

  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setOrders = useOrderStore((state) => state.setOrders);
  const orders = useOrderStore((state) => state.orders);
  const appliedFilters = useOrderStore((state) => state.appliedFilters);
  const removeFilter = useOrderStore((state) => state.removeFilter);
  const addFilter = useOrderStore((state) => state.addFilter);
  const inputRef = createRef<TextInput>();
  const [searchText, setSearchText] = useState("");
  const [ordersLoading, setOrdersLoading] = useState(true);
  const styles = StyleSheet.create({
    card: {
      borderRadius: 10,
      padding: 14,
      margin: 10,
      marginTop: 0,
      marginBottom: 10,
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
    skeletonContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
    },
    skeletonStructure: {
      backgroundColor: "#FFFFF",
      borderRadius: 8,
      marginVertical: 4,
    },
    skeleton: {
      backgroundColor: "#EDEDED",
    },
    badgeStyle: {
      paddingHorizontal: 4,
      paddingVertical: 1.5,
      borderRadius: 4,
      height: 32,
    },
    badgeTextStyle: { fontFamily: "jakarta-sans-semibold", marginBottom: 2 },
    greenBadgeStyle: {
      backgroundColor: "transparent",
      borderColor: "#009806",
    },
    redBadgeStyle: {
      backgroundColor: "transparent",
      borderColor: "#A40000",
    },
    generalBadgeStyle: {
      backgroundColor: "transparent",
      borderColor: theme.colors.grey4,
    },
    greenColor: {
      color: "#009806",
    },
    redColor: {
      color: "#A40000",
    },
    generalColor: {
      color: "#EFEFEF",
    },
  });

  const searchBarStyles = StyleSheet.create({
    inputOuterContainer: {
      width: "100%",
      margin: 0,
      paddingHorizontal: 0,
      paddingBottom: 0,
      paddingTop: 8,
    },
    inputInnerContainer: {
      borderWidth: 0.4,
      borderBottomWidth: 0.4,
      borderColor: theme.colors.grey4,
      paddingHorizontal: 8,
      margin: 0,
      backgroundColor: "#fff",
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.02,
      shadowRadius: 4,
      elevation: 2,
    },
    input: {
      fontSize: 14,
      fontFamily: "jakarta-sans-regular",
    },
    inputErrorStyle: {
      margin: 0,
      // fontSize: 0,
    },
    icon: {
      position: "absolute",
      right: 10,
    },
  });


  const generateOrdersEndpoint = (search: string) => {
    var queryParameters: string = "";
    appliedFilters.forEach((item, index) => {
      if (index > 0 && index === appliedFilters.length - 1) {
        queryParameters += "&"
      }
      if (
        item.filter === "1m" ||
        item.filter === "3m" ||
        item.filter === "6m" ||
        item.filter === "12m"
      ) {
        queryParameters += "last=" + item.filter;
      }
    });
    if (appliedFilters.length >= 1 && search.length) {
      queryParameters += `&search=${search}`
    } else if (appliedFilters.length === 0 && search.length) {
      queryParameters += `search=${search}`
    }
    const endpoint =
      queryParameters.length > 0
        ? `${api}/orders/my-orders?${queryParameters}`
        : `${api}/orders/my-orders`;
    return endpoint;
  };

  async function fetchResults(endpoint: string) {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    if (searchText.length > 0) {
      setOrdersLoading(true);
    }
    const delayDebounceFn = setTimeout(() => {
      (async () => {
        console.log("HERE IT CAME BODDY")
        // if (searchText.trim()) {
        try {
          setOrdersLoading(true);
          const endpoint = generateOrdersEndpoint(searchText);
          console.log(endpoint)
          const result = await fetchResults(endpoint);
          console.log(result)
          // setOrders(result);
        } catch (e) {
          console.log(e);
        } finally {
          setOrdersLoading(false);
        }
      })();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText, appliedFilters]);

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

      {
        ordersLoading ?
          <ScrollView contentContainerStyle={{ marginHorizontal: 10 }}>
            <Skeleton
              animation="pulse"
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
          </ScrollView> :
          <View style={{ flex: 1 }}>
            <View>
              <View style={{ marginHorizontal: 10 }}>
                <Input
                  ref={inputRef}
                  placeholder="Search..."
                  value={searchText}
                  onChangeText={setSearchText}
                  rightIcon={
                    <AntDesign
                      name="search1"
                      size={24}
                      style={{ color: theme.colors.primary }}
                    />
                  }
                  containerStyle={searchBarStyles.inputOuterContainer}
                  inputContainerStyle={searchBarStyles.inputInnerContainer}
                  inputStyle={searchBarStyles.input}
                  errorStyle={searchBarStyles.inputErrorStyle}
                />
              </View>
              <ScrollView
                contentContainerStyle={{
                  flexDirection: "row",
                  gap: 6,
                  height: 36,
                  maxHeight: 36,
                  marginBottom: 10,
                  paddingHorizontal: 10,
                  marginHorizontal: 0,
                }}
                horizontal={true}
              >
                <Badge
                  onPress={() => {
                    router.push("/order-filters-modal");
                  }}
                  status="primary"
                  value={
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <AntDesign name="filter" size={18} color="black" />
                      <Text>Filters</Text>
                    </View>
                  }
                  badgeStyle={{
                    ...styles.badgeStyle,
                    ...styles.generalBadgeStyle,
                  }}
                  textStyle={{
                    ...styles.badgeTextStyle,
                    color: theme.colors.grey0,
                  }}
                />

                {appliedFilters.map((item, index) => {
                  return (
                    <Badge
                      key={index}
                      status="primary"
                      onPress={() => removeFilter(item)}
                      value={
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Text
                            style={
                              item.filter === "veg"
                                ? [styles.badgeTextStyle, styles.greenColor]
                                : null
                            }
                          >
                            {item.value}
                          </Text>
                          <AntDesign
                            name="close"
                            size={16}
                            color="black"
                            style={{ marginTop: 2 }}
                          />
                        </View>
                      }
                      badgeStyle={
                        item.filter === "veg"
                          ? [styles.badgeStyle, styles.greenBadgeStyle]
                          : [styles.badgeStyle, styles.generalBadgeStyle]
                      }
                    />
                  );
                })}
              </ScrollView>
            </View>
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
                          {
                            order.discount ?
                              <View
                                style={styles.flexRowContainer}
                              >
                                <Text style={styles.fontStyles}>
                                  Discount
                                </Text>
                                <Text style={{ ...styles.fontStyles, color: theme.colors.success }}>
                                  -₹{order.discount}
                                </Text>
                              </View> :
                              null
                          }
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
          </View>
      }
    </SafeAreaView>
  );
};

export default Orders;
