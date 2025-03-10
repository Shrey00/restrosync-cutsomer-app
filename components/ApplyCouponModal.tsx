import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Animated,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  StatusBar,
  Pressable,
} from "react-native";
import { Card, Button, useTheme, Badge, ListItem } from "@rneui/themed";
import { Icon, Text } from "@rneui/themed";
import { Coupon } from "@/types";
import VegIcon from "../assets/veg-icon.svg";
import NonVegIcon from "../assets/non-veg-icon.svg";
import { api } from "@/constants/api";
import CartListItem from "./CartListItem";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import useUserStore from "@/store/userStore";
import { AddressType } from "@/types";
import useModalStore from "@/store/modalsStore";
import { Skeleton } from "@rneui/base";
import useOrderStore from "@/store/orderStore";
import useAddressStore from "@/store/addressStore";
import useCartStore from "@/store/cartStore";
const AddressList = ({
  allAddresses,
}: {
  allAddresses: AddressType[] | [];
}) => {
  const { theme } = useTheme();
  const { token } = useUserStore((state) => state.user);
  const styles = StyleSheet.create({
    addressText: {
      fontFamily: "jakarta-sans-medium",
      color: theme.colors.grey0,
      fontSize: 12.5,
    },
  });
  const address = useAddressStore((state) => state.address);
  const setAddress = useAddressStore((state) => state.setAddress);
  const orderDetails = useOrderStore((state) => state.newOrderDetails);
  const setOrderDetails = useOrderStore((state) => state.setNewOrderDetails);
  async function handleSelectAddress(address: AddressType) {
    const response = await fetch(`${api}/address/asdfasdfasdf`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ addressId: address.id }),
    });
    const responseData = await response.json();
    if (responseData.data) {
      setAddress(address);
      setOrderDetails({ address: address.id });
    }
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
      {allAddresses?.map((item, index) => {
        return (
          <Card
            key={index}
            containerStyle={{
              marginHorizontal: 0,
              borderRadius: 8,
              marginVertical: 8,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontFamily: "jakarta-sans-medium",
                  fontSize: 14,
                  color: theme.colors.primary,
                }}
              >
                {item.type === "Home" && (
                  <AntDesign
                    name="home"
                    size={18}
                    color={theme.colors.primary}
                  />
                )}
                {item.type === "Office" && (
                  <Feather
                    name="briefcase"
                    size={18}
                    color={theme.colors.primary}
                  />
                )}
                {"  "}
                {item.type}
              </Text>
              <Button
                disabled={address.id === item.id ? true : false}
                title={address.id === item.id ? "selected" : "select"}
                type="outline"
                containerStyle={{ borderColor: theme.colors.primary }}
                buttonStyle={{
                  paddingHorizontal: 8,
                  paddingBottom: 4,
                  paddingTop: 3,
                  borderWidth: 0.6,
                }}
                titleStyle={{ color: theme.colors.primary }}
                onPress={() => handleSelectAddress(item)}
              />
            </View>
            <View style={{ marginTop: 6 }}>
              <Text style={styles.addressText}>
                {item.address_line_1}, {item.address_line_2}
              </Text>
              <Text style={styles.addressText}>
                {item.state}, {item.city}
              </Text>
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
};
const ApplyCouponModal = () => {
  const { theme } = useTheme();
  const isOpen = useModalStore((state) => state.couponsModalOpen);
  const setIsOpen = useModalStore((state) => state.setCouponsModalOpen);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const setAppliedCoupon = useCartStore((state) => state.setAppliedCoupon);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);
  const couponDiscountAmount = useCartStore(
    (state) => state.couponDiscountAmount
  );
  const slideAnim = useRef(new Animated.Value(600)).current; // Initial position of modal (offscreen)
  const setChangeAddressModalOpen = useModalStore(
    (state) => state.setChangeAddressModalOpen
  );
  const setAddAddressModalOpen = useModalStore(
    (state) => state.setAddAddressModalOpen
  );
  const [activeCouponsList, setActiveCouponsList] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  if (isOpen) {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to view
      duration: 120,
      useNativeDriver: true,
    }).start();
  }

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 600, // Slide back down
      duration: 120,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  const handleApplyCoupon = (item: Coupon) => {
    //checks the minimum total amount required before applying.
    setAppliedCoupon(item);
  };
  const handleRemoveCoupon = (item: Coupon) => {
    //checks the minimum total amount required before applying.
    setAppliedCoupon(null);
    showToast("Coupon removed");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    openButton: {
      padding: 15,
      backgroundColor: "#673ab7",
      borderRadius: 10,
    },
    openButtonText: {
      color: "#fff",
      fontSize: 18,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      height: 600,
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    closeButton: {
      alignSelf: "flex-end",
    },
    modalText: {
      textAlign: "center",
      fontSize: 18,
      marginTop: 20,
    },
    itemDetailContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    imageAndTextContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    image: {
      width: 70,
      height: 70,
      borderRadius: 10,
    },
    optionsCardContainer: {
      borderRadius: 8,
      marginHorizontal: 0,
    },
    optionsContainer: {
      flexDirection: "column",
    },
    cartButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
    },
    cartButtonTitle: {
      fontSize: 16,
    },
    cartButtonContainer: {
      borderRadius: 4,
      paddingVertical: 8,
      width: "100%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 16,
    },
    addresssButton: {
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: 0,
      width: "100%",
    },
    skeletonContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
      marginTop: 10,
    },
    skeletonStructure: {
      backgroundColor: "#FFFFF",
      borderRadius: 8,
    },
    skeleton: {
      backgroundColor: "#EDEDED",
    },
    searchItem: {
      backgroundColor: "#FFFFFF",
      borderBottomWidth: 0.8,
      borderColor: theme.colors.secondary,
    },
  });

  const showToast = (text: string) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  };

  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          setAddressesLoading(true);
          const response = await fetch(`${api}/restaurants/active-offers`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          const responseData = await response.json();
          setActiveCouponsList(responseData);
          setAddressesLoading(false);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [isOpen]);

  useEffect(() => {
    const totalAmount = getTotalAmount();
    console.log("HEY", getTotalAmount());
    console.log("BOI", appliedCoupon?.couponCode);
    console.log("----------------------------------");
    if (appliedCoupon === undefined) {
      showToast("This coupon is not valid for this order");
    } else if (appliedCoupon && totalAmount.discountAmount > 0) {
      showToast("Coupon applied successfully");
    }
  }, [appliedCoupon]);

  return (
    <Modal transparent visible={isOpen} animationType="none">
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={{ fontFamily: "jakarta-sans-semibold", fontSize: 16 }}>
              Apply Coupon
            </Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Icon name="close" type="antdesign" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView contentContainerStyle={{ height: "100%" }}>
            {addressesLoading ? (
              <View style={styles.skeletonContainer}>
                <Skeleton
                  animation="pulse"
                  height={110}
                  style={styles.skeletonStructure}
                  skeletonStyle={styles.skeleton}
                />
                <Skeleton
                  animation="pulse"
                  height={110}
                  style={styles.skeletonStructure}
                  skeletonStyle={styles.skeleton}
                />
                <Skeleton
                  animation="pulse"
                  height={110}
                  style={styles.skeletonStructure}
                  skeletonStyle={styles.skeleton}
                />
              </View>
            ) : (
              activeCouponsList?.map((item: any, index) => {
                return (
                  <ListItem
                    key={index}
                    // onPress={() => {
                    //   removeFilter({
                    //     filter: "search",
                    //     value: "any" as string,
                    //   });
                    //   addFilter([
                    //     { filter: "search", value: item.itemName as string },
                    //   ]);
                    //   router.push(
                    //     `/menu?name=${item.restaurantName}&search=${item.itemName}&restaurantId=${item.restaurantId}`
                    //   );
                    // }}
                    style={styles.searchItem}
                  >
                    <ListItem.Content>
                      <ListItem.Title style={{ fontSize: 14 }}>
                        {item.couponCode}
                      </ListItem.Title>
                      <Text
                        style={{
                          fontFamily: "jakarta-sans-regular",
                          fontSize: 11,
                        }}
                      >
                        {item.discount}% Off upto ₹{item.maxDiscountAmount}{" "}
                        {item.minOrderValue
                          ? `on min order of ₹${item.minOrderValue}`
                          : ""}
                      </Text>
                    </ListItem.Content>
                    {appliedCoupon?.id === item.id ? (
                      <Button
                        title={'Remove'}
                        type={"outline"}
                        onPress={() => {
                          handleRemoveCoupon(item);
                        }}
                        titleStyle={{
                          fontSize: 12,
                          color: theme.colors.primary,
                        }}
                        buttonStyle={{
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderWidth: 0.8,
                          borderRadius: 6,
                        }}
                        containerStyle={{ borderRadius: 6 }}
                      />
                    ) : (
                      <Button
                        title={`${
                          appliedCoupon?.id === item.id ? "Applied" : "Apply"
                        }`}
                        type={"outline"}
                        onPress={() => {
                          handleApplyCoupon(item);
                        }}
                        titleStyle={{
                          fontSize: 12,
                          color: theme.colors.primary,
                        }}
                        buttonStyle={{
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderWidth: 0.8,
                          borderRadius: 6,
                        }}
                        disabled={appliedCoupon?.id === item.id}
                        containerStyle={{ borderRadius: 6 }}
                      />
                    )}
                  </ListItem>
                );
              })
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ApplyCouponModal;
