import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Animated,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Card, Image, Button, useTheme, CheckBox } from "@rneui/themed";
import { Icon, Text, Skeleton } from "@rneui/themed";
import { CartItemProps, FoodItemProps } from "@/types/index";
import { Rating } from "react-native-ratings";
import VegIcon from "../assets/veg-icon.svg";
import NonVegIcon from "../assets/non-veg-icon.svg";
import { api } from "@/constants/api";
import useUserStore from "@/store/userStore";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import useCartStore from "@/store/cartStore";
import { VariantsData } from "@/types";
import useModalStore from "@/store/modalsStore";
import { restaurantId } from "@/constants/restaurantInfo";

const AddToCartModal = ({ menuItemData }: { menuItemData: FoodItemProps }) => {
  const isOpen = useModalStore((state) => state.addToCartModalOpen);
  const setIsOpen = useModalStore((state) => state.setAddToCartModalOpen);
  const slideAnim = useRef(new Animated.Value(600)).current; // Initial position of modal (offscreen)
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setIndex] = React.useState(0);
  const [variantsData, setVariantsData] = useState<VariantsData[]>([]);
  const [variantsDataLoading, setVariantsDataLoading] = useState(true);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [cartButtonText, setcartButtonText] = useState("Add");
  const addToCart = useCartStore((state) => state.addToCart);
  const { theme } = useTheme();
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
    Animated.timing(slideAnim, {
      toValue: 600, // Slide back down
      duration: 120,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
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
          const response = await fetch(`${api}/menu/item/variants`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ menuItemId: menuItemData.id }),
          });
          const responseData = await response.json();
          setVariantsData(responseData.data);
          setVariantsDataLoading(false);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [isOpen]);
  useEffect(() => {
    if (variantsData[selectedIndex]?.sellingPrice) {
      setcartButtonText(
        `Add to cart at ₹${variantsData[selectedIndex]?.sellingPrice}`
      );
    }
  }, [selectedIndex, variantsDataLoading]);
  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  async function handleAddToCart() {
    if (cartButtonText === "Added 🎉") return;
    try {
      setAddToCartLoading(true);
      const response = await fetch(`${api}/cart/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        //sending menu id of variants
        body: JSON.stringify({ menuItemId: variantsData[selectedIndex]?.id }),
      });
      const responseData = await response.json()
      const cartItemParams = {
        id: responseData[0].id, //cart item id
        name: menuItemData.name,
        menuItemId: variantsData[selectedIndex]?.id,
        sellingPrice: responseData[0].finalPrice,
        quantity: responseData[0].quantity,
        cuisineType: menuItemData.cuisineType,
        markedPrice: variantsData[selectedIndex]?.markedPrice,
        discount: variantsData[selectedIndex]?.discount,
        restaurantId: menuItemData.restaurantId
      };
      addToCart(cartItemParams);
      setcartButtonText("Added 🎉");
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
      setAddToCartLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Modal transparent visible={isOpen} animationType="none">
      <View style={styles.modalOverlay}>
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
                <View style={{width:IMAGE_WIDTH}}>
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                  >
                    {menuItemData.images?.map((image, index) => (
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
                    <Text style={{marginBottom:2,fontFamily:"jakarta-sans-medium", fontSize: 14}}>{menuItemData.name}</Text>
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
              <Card containerStyle={styles.optionsCardContainer}>
                <Text
                  style={{
                    fontFamily: "jakarta-sans-semibold",
                    fontSize: 14,
                    marginBottom: 5,
                  }}
                >
                  Options{" "}
                  <Text
                    style={{
                      fontFamily: "jakarta-sans-regular",
                      color: theme.colors.grey0,
                    }}
                  >
                    - Please select any one
                  </Text>
                </Text>
                <View style={styles.optionsContainer}>
                  {variantsData?.map(
                    (
                      item: {
                        id: string;
                        name: string;
                        variantName: string;
                        sellingPrice: number;
                        variant: string;
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
            ) : (
              <Skeleton
                animation="pulse"
                height={140}
                style={styles.skeletonStructure}
                skeletonStyle={styles.skeleton}
              />
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
