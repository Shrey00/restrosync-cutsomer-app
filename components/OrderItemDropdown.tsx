import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter, Href } from "expo-router";
import useUserStore from '@/store/userStore';
import { api } from "@/constants/api";
import useOrderStore from "@/store/orderStore";

const OrderItemDropdown = ({ id, visible, setVisible, index }: { id: string, visible: boolean, setVisible: (value: number) => void, index: number }) => {
  const router = useRouter();
  const token = useUserStore((state) => state.user.token);
  const removeOrderItem = useOrderStore((state) => state.removeOrderItem);
  const toggleDropdown = () => {
    if (visible)
      setVisible(-1);
    else
      setVisible(index)
  };
  const handleRemoveOrderItem = async () => {
    try {
      const response = await fetch(`${api}/orders/order-item/remove/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const responseData = await response.json();
      console.log(responseData)
      removeOrderItem(id);
    } catch (e) {
      console.log(e);
    }

  }
  const handleMenuItemPress = (action: string) => {
    setVisible(-1);
    const url = ("/order-details?orderId=" + id) as Href;
    if (action === "order-detail") router.push(url);
    if (action === "remove") handleRemoveOrderItem()
  };
  // const orders = useOrderStore;
  // useEffect(() => {
  //   (async () => {
  //     const response = await fetch(`${api}/order-details`);
  //   })();
  // });
  const styles = StyleSheet.create({
    container: {
      // alignItems: "flex-end",
      // position: 'relative'
    },
    overlay: {
      // flex: 1,
      // height: "100%",
      // width: "100%",
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      // zIndex: 10,
      backgroundColor: 'black'
      // justifyContent: "flex-start",
      // alignItems: "flex-end",
    },
    dropdown: {
      backgroundColor: "white",
      padding: 6,
      borderRadius: 5,
      display: visible ? 'flex' : 'none',
      elevation: 5,
      position: 'absolute',
      top: 20,
      right: 30,
      zIndex: 99,
      minWidth: 160,
      maxHeight: 160,
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

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={toggleDropdown} style={{ padding: 5 }}>
        <Feather name="more-vertical" size={20} color="black" />
      </TouchableOpacity>
      {/* <Modal
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        style={styles.container}
      > */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => setVisible(-1)}
      />
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

      {/* </TouchableOpacity> */}
      {/* </Modal> */}
    </View>
  );
};


export default OrderItemDropdown;
