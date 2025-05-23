import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Icon } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { socketApi } from "../constants/api";
import { Card } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { SafeAreaView } from "react-native-safe-area-context";
import VegIcon from "../assets/veg-icon.svg";
import NonVegIcon from "../assets/non-veg-icon.svg";
import useOrderStore from "@/store/orderStore";
import { useRouter } from "expo-router";

const OrderStatus = () => {
  const { orderId } = useLocalSearchParams();
  const getOrder = useOrderStore((state) => state.getOrder);
  const orderDetail = getOrder(orderId as string);
  console.log(orderDetail);
  // const [orderStatus, setOrderStatus] = useState("");
  const [stages, setStages] = useState([
    { id: 1, name: "Order Confirmed", icon: "check-circle", reached: false },
    { id: 2, name: "Preparing", icon: "utensils", reached: false },
    { id: 3, name: "Order Picked Up", icon: "truck", reached: false },
    { id: 4, name: "Out for Delivery", icon: "map-marker-alt", reached: false },
    { id: 5, name: "Delivered", icon: "home", reached: false },
  ]);
  function renderUpdateStages(orderStatus: string) {
    const updatedStages = stages.map((stage) => {
      if (
        orderDetail &&
        (orderDetail.deliveryStatus === "Confirmed" ||
          orderStatus === "Confirmed") &&
        stage.id <= 1
      ) {
        stage.reached = true;
      } else if (
        orderDetail &&
        (orderDetail.deliveryStatus === "Preparing" ||
          orderStatus === "Preparing" ||
          orderStatus === "Ready") &&
        stage.id <= 2
      ) {
        stage.reached = true;
      } else if (
        orderDetail &&
        (orderDetail.deliveryStatus === "Picked" || orderStatus === "Picked") &&
        stage.id <= 3
      ) {
        stage.reached = true;
      } else if (
        orderDetail &&
        (orderDetail.deliveryStatus === "Enroute" ||
          orderStatus === "Enroute") &&
        stage.id <= 4
      ) {
        stage.reached = true;
      } else if (
        orderDetail &&
        (orderDetail.deliveryStatus === "Delivered" ||
          orderStatus === "Delivered") &&
        stage.id <= 5
      ) {
        stage.reached = true;
      } else {
        stage.reached = false;
      }
      return stage;
    });
    setStages(updatedStages);
  }
  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket(`${socketApi}/order-status?orderId=${orderId}`);
    ws.onopen = () => {
      console.log("WebSocket connection opened.");
      const message = {
        type: "join",
      };
      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
      // setOrderStatus(event.data.orderStatus);
      renderUpdateStages(JSON.parse(event.data).orderStatus);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    renderUpdateStages(orderDetail?.deliveryStatus!);
    return () => {
      ws.close();
    };
  }, []);

  const { theme } = useTheme();
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

  const renderStage = ({ item, index }: { item: any; index: number }) => {
    const isLastStage = index === stages.length - 1;
    const circleColor = item.reached
      ? theme.colors.primary
      : theme.colors.secondary;
    const lineColor = item.reached
      ? theme.colors.primary
      : theme.colors.secondary;

    return (
      <View style={styles.stageContainer}>
        {/* Left Circle with Icon */}
        <View style={styles.iconContainer}>
          <View style={[styles.circle, { borderColor: circleColor }]}>
            <Icon
              name={item.icon}
              type="font-awesome-5"
              size={20}
              color={
                item.reached ? theme.colors.primary : theme.colors.secondary
              }
            />
          </View>
          {!isLastStage && (
            <View style={[styles.line, { backgroundColor: lineColor }]} />
          )}
        </View>

        {/* Stage Name */}
        <Text style={styles.stageText}>{item.name}</Text>
      </View>
    );
  };
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View>
        <Pressable
          style={{ marginLeft: 12, flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            router.replace("/");
          }}
        >
          <Entypo
            name="chevron-thin-left"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            style={{
              fontFamily: "jakarta-sans-medium",
              fontSize: 20,
              color: theme.colors.primary,
              marginBottom: 4,
              marginLeft: 1,
            }}
          >
            Home
          </Text>
        </Pressable>
        <View>
          <Text
            style={{
              fontFamily: "jakarta-sans-bold",
              fontSize: 18,
              marginLeft: 14,
            }}
          >
            Order Status
          </Text>
        </View>
      </View>

      <Card containerStyle={styles.card}>
        <Text style={{ fontFamily: "jakarta-sans-semibold", fontSize: 16 }}>
          {orderDetail?.restaurantName}
        </Text>

        <View style={styles.orderItemsContainerBorder}>
          <Text
            style={{
              ...styles.fontStyles,
              color: theme.colors.grey0,
              marginBottom: 6,
            }}
          >
            {orderDetail?.orderId}
          </Text>
          {orderDetail?.orderItems?.map((orderItem, orderItemIndex) => {
            return (
              <View style={styles.flexRowContainer} key={orderItemIndex}>
                <Text style={styles.fontStyles}>
                  {orderItem.cuisineType === "veg" ? (
                    <VegIcon width={14} height={14} />
                  ) : (
                    <NonVegIcon width={18} height={18} />
                  )}
                  {"  "}
                  {orderItem.quantity} x {orderItem.name}
                </Text>
                <Text style={styles.fontStyles}>₹{orderItem.amount}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.flexRowContainer}>
          <Text style={styles.fontStyles}>Grand Total</Text>
          <Text style={styles.fontStyles}>₹{orderDetail?.totalAmount}</Text>
        </View>
      </Card>
      <Card
        containerStyle={{
          ...styles.card,
          paddingHorizontal: 18,
          paddingVertical: 28,
        }}
      >
        <View>
          <FlatList
            data={stages}
            renderItem={renderStage}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Card>
    </SafeAreaView>
  );
};

export default OrderStatus;
