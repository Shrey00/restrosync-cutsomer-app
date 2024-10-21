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
import { Icon, Text } from "@rneui/themed";
import { CartItemProps, FoodItemProps } from "@/types/index";
import { Rating } from "react-native-ratings";
import VegIcon from "../assets/veg-icon.svg";
import NonVegIcon from "../assets/non-veg-icon.svg";
import { api } from "@/constants/api";
import CartListItem from "./CartListItem";
import useUserStore from "@/store/userStore";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import useCartStore from "@/store/cartStore";
import { VariantsData } from "@/types";
const AddToCartModal = ({
  modalVisible,
  setModalVisible,
  menuItemData,
}: {
  modalVisible: boolean;
  setModalVisible: any;
  menuItemData: FoodItemProps;
}) => {
  // const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(600)).current; // Initial position of modal (offscreen)
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setIndex] = React.useState(0);
  const [variantsData, setVariantsData] = useState<VariantsData[]>([]);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [cartButtonText, setcartButtonText] = useState("Add");
  const addToCart = useCartStore((state) => state.addToCart);
  const { theme } = useTheme();
  const user = useUserStore((state) => state.user);
  if (modalVisible) {
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
    }).start(() => setModalVisible(false));
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
  });

  useEffect(() => {
    if (modalVisible) {
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
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [modalVisible]);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  async function handleAddToCart() {
    if (cartButtonText !== "Add") return;
    try {
      const cartItemParams = {
        name: menuItemData.name,
        id: variantsData[selectedIndex]?.id,
        sellingPrice: variantsData[selectedIndex]?.sellingPrice,
        images: menuItemData.images,
        quantity: 1,
        cuisineType: menuItemData.cuisineType,
        markedPrice: variantsData[selectedIndex]?.markedPrice,
        discount: variantsData[selectedIndex]?.discount,
      };
      setAddToCartLoading(true);
      addToCart(cartItemParams);
      const response = await fetch(`${api}/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user.id, itemId: cartItemParams.id }),
      });
      setcartButtonText("Added 🎉");
      setAddToCartLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Modal transparent visible={modalVisible} animationType="none">
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Modal Content */}
          <View>
            {/* Close Button */}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Icon name="close" type="antdesign" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.itemDetailContainer}>
              <View style={styles.imageAndTextContainer}>
                <View>
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
                <View>
                  <View>
                    {menuItemData.cuisineType === "veg" ? (
                      <VegIcon width={14} height={14} />
                    ) : (
                      <NonVegIcon width={14} height={14} />
                    )}
                    <Text>{menuItemData.name}</Text>
                  </View>
                  <Rating
                    type="star"
                    ratingCount={5.0}
                    fractions={1}
                    imageSize={16}
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
                        <Text>{item.variantName}</Text>
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
            title={`Add to cart at ₹${variantsData[selectedIndex]?.sellingPrice}`}
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
