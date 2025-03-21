import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter, Href } from "expo-router";
const OrderItemDropdown = ({ id }: { id: string }) => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const toggleDropdown = () => {
    setVisible(!visible);
  };
  const handleMenuItemPress = (action: string) => {
    setVisible(false);
    const url = ("/order-details?orderId=" + id) as Href<string>;
    if (action === "order-detail") router.push(url);
  };
  // const orders = useOrderStore;
  // useEffect(() => {
  //   (async () => {
  //     const response = await fetch(`${api}/order-details`);
  //   })();
  // });
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown} style={{ padding: 5 }}>
        <Feather name="more-vertical" size={20} color="black" />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleMenuItemPress("order-detail")}
            >
              <Feather name="file-text" size={18} color="black" />
              <Text style={styles.optionText}>Order Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleMenuItemPress("remove")}
            >
              <Feather name="trash-2" size={18} color="black" />
              <Text style={styles.optionText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  dropdown: {
    backgroundColor: "white",
    padding: 6,
    borderRadius: 5,
    marginTop: 70,
    marginRight: 50,
    elevation: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 13,
    fontFamily: "jakarta-sans-regular",
  },
});

export default OrderItemDropdown;
