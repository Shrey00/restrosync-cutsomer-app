import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Animated,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Card, Button, useTheme } from "@rneui/themed";
import { Icon, Text } from "@rneui/themed";
import { api } from "@/constants/api";
import { Skeleton } from "@rneui/base";
import { AddressType } from "@/types";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import useUserStore from "@/store/userStore";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import useModalStore from "@/store/modalsStore";
import useOrderStore from "@/store/orderStore";
import useAddressStore from "@/store/addressStore";

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
  const setOrderDetails = useOrderStore((state) => state.setNewOrderDetails);
  async function handleSelectAddress(address: AddressType) {
    const response = await fetch(`${api}/address/update-selected-address`, {
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
const ChangeAddressModal = () => {
  // const isOpen = useModalStore((state) => state.changeAddressModalOpen);
  const isOpen = true;
  // const setIsOpen = useModalStore((state) => state.setChangeAddressModalOpen);
  const slideAnim = useRef(new Animated.Value(600)).current; // Initial position of modal (offscreen)
  const allAddresses = useAddressStore((state) => state.allAddresses);
  const setAllAddresses = useAddressStore((state) => state.setAllAddresses);
  // const setChangeAddressModalOpen = useModalStore(
  //   (state) => state.setChangeAddressModalOpen
  // );
  const setAddAddressModalOpen = useModalStore(
    (state) => state.setAddAddressModalOpen
  );
  const [addressesLoading, setAddressesLoading] = useState(false);
  const { theme } = useTheme();
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  if (isOpen) {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to view
      duration: 120,
      useNativeDriver: true,
    }).start();
  }

  const closeModal = () => {
    // Animated.timing(slideAnim, {
    //   toValue: 600, // Slide back down
    //   duration: 120,
    //   useNativeDriver: true,
    // }).start(() => setIsOpen(false));
    router.back();
  };

  //@TODO - Review again and fix for opening add address modal
  const handleAddAddress = () => {
    // setChangeAddressModalOpen(false);
    // setAddAddressModalOpen(true);
    router.push('/add-address-modal');
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
    //button
    cartButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      // marginVertical: 8,
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
  });

  //@TODO - To be removed, to make a call for addresses in a single place, currently calling in cart and here.
  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          setAddressesLoading(true);
          const response = await fetch(`${api}/address/get-addresses`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          const responseData = await response.json();
          setAllAddresses(responseData.data);
          setAddressesLoading(false);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [isOpen]);

  return (
    <Modal transparent visible={isOpen} animationType="none">
      <View style={styles.modalOverlay}>
        <Pressable style={{ flex: 1 }} onPress={closeModal}></Pressable>

        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={{ fontFamily: "jakarta-sans-semibold", fontSize: 16 }}>
              Select Address
            </Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Icon name="close" type="antdesign" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView contentContainerStyle={{ height: "100%" }}>
            <Pressable onPress={handleAddAddress}>
              <Card containerStyle={styles.addresssButton}>
                <View style={styles.addresssButton}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome6
                      name="plus"
                      size={16}
                      color={theme.colors.primary}
                      style={{ marginRight: 6 }}
                    />
                    <Text>Add new address</Text>
                  </View>
                  <Entypo
                    name="chevron-thin-right"
                    size={18}
                    color={theme.colors.primary}
                  />
                </View>
              </Card>
            </Pressable>
            <View style={{ marginTop: 12, marginBottom: 12 }}>
              {allAddresses.length > 0 && (
                <Text style={{ fontFamily: "jakarta-sans-semibold" }}>
                  Saved Addresses
                </Text>
              )}
            </View>
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
              <AddressList allAddresses={allAddresses} />
            )}
          </ScrollView>
          {/* <Button
            icon={
              <FontAwesome6
                name="plus"
                size={16}
                color="#FDE4E8"
                style={{ marginRight: 6 }}
              />
            }
            title={`Add to cart at ₹${variantsData[selectedIndex]?.sellingPrice}`}
            titleStyle={styles.cartButtonTitle}
            buttonStyle={styles.cartButton}
            containerStyle={styles.cartButtonContainer}
            onPress={handleAddToCart}
          /> */}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ChangeAddressModal;
