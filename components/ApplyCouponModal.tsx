import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Animated,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { Button, useTheme, ListItem } from "@rneui/themed";
import { Icon, Text } from "@rneui/themed";
import { Coupon } from "@/types";
import { api } from "@/constants/api";
import useUserStore from "@/store/userStore";
import useModalStore from "@/store/modalsStore";
import { Skeleton } from "@rneui/base";
import useCartStore from "@/store/cartStore";
const ApplyCouponModal = () => {
  const { theme } = useTheme();
  const isOpen = useModalStore((state) => state.couponsModalOpen);
  const setIsOpen = useModalStore((state) => state.setCouponsModalOpen);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const setAppliedCoupon = useCartStore((state) => state.setAppliedCoupon);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);
  const slideAnim = useRef(new Animated.Value(600)).current; // Initial position of modal (offscreen)
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
