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
import { Card, Image, Button, useTheme, CheckBox } from "@rneui/themed";
import { Icon, Text, Skeleton } from "@rneui/themed";
import { Rating } from "react-native-ratings";
import VegIcon from "../assets/veg-icon.svg";
import NonVegIcon from "../assets/non-veg-icon.svg";
import { api } from "@/constants/api";
import { useRouter } from "expo-router";
import useUserStore from "@/store/userStore";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import useCartStore from "@/store/cartStore";
import useModalStore from "@/store/modalsStore";
import { checkArrayValueEquality } from "../utils";
const AddToCartModal = () => {
  //   const isOpen = useModalStore((state) => state.addToCartModalOpen);
  const isOpen = true;
  //   const setIsOpen = useModalStore((state) => state.setAddToCartModalOpen);
  const slideAnim = useRef(new Animated.Value(600)).current; // Initial position of modal (offscreen)
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setIndex] = React.useState(0);
  const [addOnCheckedIndex, setAddOnCheckedIndex] = useState<any>({});
  const [variantsDataLoading, setVariantsDataLoading] = useState(true);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [cartButtonText, setcartButtonText] = useState("Add");
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const token = useUserStore((state) => state.user.token);
  const cartItems = useCartStore((state) => state.cart);
  const setHoverCardVisble = useModalStore((state) => state.setHoverCartInfo);
  const setHoverCartInfo = useCartStore((state) => state.setCartHoverInfo);
  const menuItemData = useCartStore((state) => state.selectedMenuItemData);
  const [addOnsState, setAddOnsState] = useState<any[]>([]);
  const [optionsState, setOptionsState] = useState<any[]>([]);
  const { theme } = useTheme();
  const router = useRouter();
  const IMAGE_WIDTH = 70;
  const user = useUserStore((state) => state.user);
  if (isOpen) {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to view
      duration: 120,
      useNativeDriver: true,
    }).start();
  }

  const closeModal = () => {
    router.back();
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
      width: IMAGE_WIDTH,
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
      height: 50,
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
    skeletonContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
    },
    skeletonStructure: {
      backgroundColor: "#FFFFF",
      borderRadius: 8,
      marginTop: 10,
    },
    skeleton: {
      backgroundColor: "#EDEDED",
    },
  });

  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          setVariantsDataLoading(true);
          const response = await fetch(`${api}/menu/item/variants`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ menuItemId: menuItemData.id }),
          });
          const responseData = await response.json();
          const addOnsData = responseData.data.filter((item: any) => {
            return item.variant === "add-on";
          });
          const optionsData = responseData.data.filter((item: any) => {
            return item.variant === "child";
          });
          setAddOnsState(addOnsData);
          setOptionsState(optionsData);
          setVariantsDataLoading(false);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [isOpen]);
  useEffect(() => {
    const price = optionsState[selectedIndex]
      ? optionsState[selectedIndex]?.sellingPrice
      : menuItemData.sellingPrice;
    setcartButtonText(`Add to cart at ₹${price}`);
  }, [selectedIndex, isOpen, optionsState]);
  useEffect(() => {
    const addOnsData = getAddOns();
    const totalPrice = getTotalPrice(addOnsData);
    setcartButtonText(`Add to cart at ₹${totalPrice}`);
  }, [addOnCheckedIndex, isOpen]);
  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };
  function getAddOns() {
    const arr: {
      id: string;
      name: string;
      sellingPrice: number;
      cuisineType: string;
    }[] = [];

    Object.keys(addOnCheckedIndex).forEach((key: any) => {
      if (addOnCheckedIndex[key] && addOnCheckedIndex[key]?.exists) {
        arr.push({
          id: addOnCheckedIndex[key].id,
          name: addOnCheckedIndex[key].name,
          sellingPrice: addOnCheckedIndex[key].sellingPrice,
          cuisineType: addOnCheckedIndex[key].cuisineType,
        });
      }
    });
    return arr;
  }
  function getTotalPrice(addOnsData: any[]) {
    let totalPrice = 0;
    totalPrice += optionsState[selectedIndex]
      ? optionsState[selectedIndex].sellingPrice
      : menuItemData.sellingPrice;
    const addOns = addOnsData;
    addOns.forEach((item) => {
      totalPrice += item.sellingPrice;
    });
    return totalPrice;
  }

  function checkExisting(
    menuItemId: string,
    addOns: { id: string; name: string; sellingPrice: number }[]
  ): boolean {
    //check addons
    //find id first
    const item = cartItems.find((item) => item.menuItemId === menuItemId);
    const foundItemAddons = item ? item.addOns : [];
    const addOnsEquality = checkArrayValueEquality(foundItemAddons, addOns);
    return item && addOnsEquality;
  }
  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    const response = await fetch(`${api}/cart/update-quantity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId: id, quantity }),
    });
    if (response.status === 200) updateQuantity(id, quantity);
  };
  async function handleAddToCart() {
    if (cartButtonText === "Added 🎉") return;
    try {
      const menuItemId = optionsState[selectedIndex]
        ? optionsState[selectedIndex].id
        : menuItemData.id;
      setAddToCartLoading(true);
      const addOnsData = getAddOns();
      const exists = checkExisting(menuItemId, addOnsData);
      const cartItem = cartItems.find((item) => item.menuItemId === menuItemId);

      if (exists) {
        handleUpdateQuantity(cartItem?.id!, cartItem?.quantity! + 1);
        setcartButtonText("Added 🎉");
        setHoverCardVisble(true);
        setTimeout(() => {
          router.back();
        }, 1000);
        setAddToCartLoading(false);
        setcartButtonText("Add");
        return;
      }
      const response = await fetch(`${api}/cart/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        //sending menu id of variants
        body: JSON.stringify({
          menuItemId: menuItemId,
          addOns: addOnsData,
        }),
      });
      const responseData = await response.json();
      const totalPrice = getTotalPrice(addOnsData);
      const cartItemParams = {
        id: responseData[0].id, //cart item id
        name: menuItemData.name,
        menuItemId: optionsState[selectedIndex]
          ? optionsState[selectedIndex].id
          : menuItemData.id,
        sellingPrice: totalPrice,
        quantity: responseData[0].quantity,
        cuisineType: menuItemData.cuisineType,
        markedPrice: optionsState[selectedIndex]
          ? optionsState[selectedIndex].markedPrice
          : menuItemData.markedPrice,
        discount: optionsState[selectedIndex]?.discount,
        restaurantId: menuItemData.restaurantId,
        addOns: addOnsData,
        category: responseData[0].category,
      };
      addToCart(cartItemParams);
      setHoverCartInfo(cartItemParams, ++cartItems.length);
      setcartButtonText("Added 🎉");
      setHoverCardVisble(true);
      setTimeout(() => {
        router.back();
      }, 1000);
      setcartButtonText("Add");
      setAddToCartLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

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
          {/* Modal Content */}
          <View>
            {/* <View> */}
            <View style={styles.modalHeader}>
              <Text
                style={{ fontFamily: "jakarta-sans-semibold", fontSize: 16 }}
              >
                Select Options
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icon name="close" type="antdesign" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* </View> */}

            <View style={styles.itemDetailContainer}>
              <View style={styles.imageAndTextContainer}>
                <View style={{ width: IMAGE_WIDTH }}>
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                  >
                    {menuItemData?.images?.map((image, index) => (
                      <Image
                        key={index}
                        source={{ uri: image }}
                        style={styles.image}
                        PlaceholderContent={<Text>Loading...</Text>}
                      />
                    ))}
                  </ScrollView>
                </View>
                <View
                  style={{ flexDirection: "column", alignItems: "flex-start" }}
                >
                  <View>
                    {menuItemData.cuisineType === "veg" ? (
                      <VegIcon width={14} height={14} />
                    ) : (
                      <NonVegIcon width={14} height={14} />
                    )}
                    <Text
                      style={{
                        marginBottom: 2,
                        fontFamily: "jakarta-sans-medium",
                        fontSize: 14,
                      }}
                    >
                      {menuItemData.name}
                    </Text>
                  </View>
                  <Rating
                    type="star"
                    ratingCount={5.0}
                    fractions={1}
                    imageSize={18}
                    readonly={true}
                    showReadOnlyText={false}
                    ratingBackgroundColor="#E8D6AE"
                  />
                </View>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "jakarta-sans-semibold",
                    fontSize: 12,
                    color: theme.colors.grey2,
                  }}
                >
                  Starts at
                </Text>
                <Text
                  style={{
                    fontFamily: "jakarta-sans-semibold",
                    fontSize: 14,
                    color: theme.colors.grey1,
                  }}
                >
                  ₹{menuItemData?.sellingPrice}
                </Text>
              </View>
            </View>
            {!variantsDataLoading ? (
              <View>
                {optionsState.length > 0 && (
                  <Card containerStyle={styles.optionsCardContainer}>
                    <Text
                      style={{
                        fontFamily: "jakarta-sans-semibold",
                        fontSize: 14,
                        marginBottom: 5,
                      }}
                    >
                      Options{" "}
                    </Text>
                    <View style={styles.optionsContainer}>
                      {optionsState?.map(
                        (
                          item: {
                            id: string;
                            name: string;
                            sellingPrice: number;
                            variant: string;
                            cuisineType: string;
                          },
                          index
                        ) => {
                          return (
                            <View
                              key={index}
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginVertical: 2,
                              }}
                            >
                              <Text>{item.name}</Text>
                              <View style={{ flexDirection: "row" }}>
                                <Text>₹{item?.sellingPrice}</Text>
                                <CheckBox
                                  checked={selectedIndex === index}
                                  onPress={() => setIndex(index)}
                                  checkedIcon="dot-circle-o"
                                  uncheckedIcon="circle-o"
                                  size={24}
                                  containerStyle={{
                                    paddingBottom: 0,
                                    marginBottom: 0,
                                    paddingTop: 0,
                                    marginTop: 0,
                                    marginLeft: 0,
                                    marginRight: 0,
                                    paddingRight: 0,
                                  }}
                                />
                              </View>
                            </View>
                          );
                        }
                      )}
                    </View>
                  </Card>
                )}
                {addOnsState.length > 0 && (
                  <Card containerStyle={styles.optionsCardContainer}>
                    <Text
                      style={{
                        fontFamily: "jakarta-sans-semibold",
                        fontSize: 14,
                        marginBottom: 5,
                      }}
                    >
                      Add-ons{" "}
                    </Text>

                    <View style={styles.optionsContainer}>
                      {addOnsState?.map(
                        (
                          item: {
                            id: string;
                            name: string;
                            sellingPrice: number;
                            variant: string;
                            cuisineType: string;
                          },
                          index
                        ) => {
                          const exists = addOnCheckedIndex[index]?.exists;
                          return (
                            <View
                              key={index}
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginVertical: 2,
                              }}
                            >
                              <Text>{item.name}</Text>
                              <View style={{ flexDirection: "row" }}>
                                <Text>₹{item?.sellingPrice}</Text>
                                <CheckBox
                                  checked={exists}
                                  onPress={() =>
                                    setAddOnCheckedIndex({
                                      ...addOnCheckedIndex,
                                      [index]: {
                                        cuisineType: item.cuisineType,
                                        exists: exists ? !exists : true,
                                        id: item.id,
                                        sellingPrice: item.sellingPrice,
                                        name: item.name,
                                      },
                                    })
                                  }
                                  iconType="material-community"
                                  checkedIcon="checkbox-marked"
                                  uncheckedIcon="checkbox-blank-outline"
                                  size={24}
                                  containerStyle={{
                                    paddingBottom: 0,
                                    marginBottom: 0,
                                    paddingTop: 0,
                                    marginTop: 0,
                                    marginLeft: 0,
                                    marginRight: 0,
                                    paddingRight: 0,
                                  }}
                                />
                              </View>
                            </View>
                          );
                        }
                      )}
                    </View>
                  </Card>
                )}
              </View>
            ) : (
              <View>
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
              </View>
            )}
          </View>
          <Button
            icon={
              <FontAwesome6
                name="plus"
                size={16}
                color="#FDE4E8"
                style={{ marginRight: 6 }}
              />
            }
            loading={addToCartLoading}
            title={cartButtonText}
            titleStyle={styles.cartButtonTitle}
            buttonStyle={styles.cartButton}
            containerStyle={styles.cartButtonContainer}
            onPress={handleAddToCart}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AddToCartModal;
