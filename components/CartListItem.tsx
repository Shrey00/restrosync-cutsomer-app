import { View, StyleSheet } from "react-native";
import { useTheme } from "@rneui/themed";
import React from "react";
import { ListItem, Text, Button, Icon, Divider } from "@rneui/themed";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import useCartStore from "@/store/cartStore";
import VegIcon from "../assets/veg-icon.svg";
import NonVegIcon from "../assets/non-veg-icon.svg";
import { CartItemProps } from "@/types/index";
const CartListItem = ({
  id,
  name,
  cuisineType,
  sellingPrice,
  markedPrice,
  discount,
  quantity,
}: CartItemProps) => {
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
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const styles = StyleSheet.create({
    listItem: {
      // marginBottom: 2,
      backgroundColor: "transparent",
      borderBottomWidth: 0,
      borderRadius: 8,
      padding: 8,
    },
    cartItemContainer: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    },
    itemName: {
      fontSize: 13,
      fontFamily: "jakarta-sans-semibold",
    },
    priceContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    quantityContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: 82,
      // borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.secondary,
      borderRadius: 4,
    },
    finalPrice: {
      fontSize: 11,
      fontFamily: "jakarta-sans-bold",
      marginRight: 8,
    },
    markedPrice: {
      fontSize: 12,
      textDecorationLine: "line-through",
      color: modTheme.colors.grey1,
      marginRight: 8,
    },
    discount: {
      fontSize: 12,
      color: modTheme.colors.success,
    },
    quantityText: {
      fontSize: 12,
    },
    quantityButtonMinus: {
      width: 26,
      height: 26,
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: theme.colors.secondary,
      borderRadius: 4,
    },
    quantityButtonPlus: {
      width: 26,
      height: 26,
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      backgroundColor: theme.colors.secondary,
      borderRadius: 4,
    },
  });
  return (
    <ListItem key={id} bottomDivider containerStyle={styles.listItem}>
      <ListItem.Content style={styles.cartItemContainer}>
        <View>
          <ListItem.Title style={styles.itemName}>
            {cuisineType === "veg" ? (
              <VegIcon width={12} height={12} />
            ) : (
              <NonVegIcon width={12} height={12} />
            )}
            {"  "}
            {name}
          </ListItem.Title>
          <View style={styles.priceContainer}>
            <Text style={styles.finalPrice}>₹{sellingPrice.toFixed(2)}</Text>
            <Text style={styles.markedPrice}>₹{markedPrice.toFixed(2)}</Text>
            <Text style={styles.discount}>
              Save ₹{(markedPrice * discount) / 100}
            </Text>
          </View>
        </View>
        <View style={styles.quantityContainer}>
          <Button
            icon={
              <FontAwesome6
                name="minus"
                size={12}
                color={theme.colors.primary}
              />
            }
            onPress={() => {
              updateQuantity(id, --quantity);
            }}
            buttonStyle={styles.quantityButtonMinus}
          />
          <Text style={styles.quantityText}>{quantity}</Text>
          <Button
            icon={
              <FontAwesome6
                name="plus"
                size={12}
                color={theme.colors.primary}
              />
            }
            onPress={() => updateQuantity(id, ++quantity)}
            buttonStyle={styles.quantityButtonPlus}
          />
        </View>
      </ListItem.Content>
    </ListItem>
  );
};

export default CartListItem;
