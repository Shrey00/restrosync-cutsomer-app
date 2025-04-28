import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { Text, Button, Skeleton } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import { api } from "@/constants/api";
import useUserStore from "../store/userStore";
import useCartStore from "../store/cartStore";
import useModalStore from "@/store/modalsStore";
import useMenuStore from "@/store/menuStore";
import { useRouter, Redirect } from "expo-router";
import { Image } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { FoodItemProps } from "@/types";
import { checkArrayValueEquality } from "@/utils";
import AddToCartModal from "@/components/AddToCartModal";
import { Rating } from "react-native-ratings";
export default function FoodDetail() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  // const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
  // const modTheme = {
  //   colors: {
  //     primary: theme.colors.primary,
  //     secondary: theme.colors.secondary,
  //     background: theme.colors.background,
  //     white: "#FFFFFF",
  //     grey0: "#E0E0E0",
  //     grey1: "#BDBDBD",
  //     success: "#4CAF50",
  //     error: "#F44336",
  //   },
  // };
  const { width } = Dimensions.get("window");
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      backgroundColor: theme.colors.background,
    },
    imageContainer: {},
    image: {
      width: width,
      height: 280,
      // borderTopRightRadius: 10,
      // borderBottomRightRadius: 10,
    },
    name: {
      fontFamily: "jakarta-sans-semibold",
      fontSize: 22,
    },
    description: {
      fontFamily: "jakarta-sans-regular",
      fontSize: 14,
    },
    pagination: {
      flexDirection: "row",
      position: "absolute",
      bottom: 50,
      alignSelf: "center",
    },
    paginationDot: {
      width: 6,
      height: 6,
      borderRadius: 4,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      marginHorizontal: 4,
    },
    paginationDotActive: {
      backgroundColor: "#fff",
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
      marginVertical: 10,
    },
    skeleton: {
      backgroundColor: "#EDEDED",
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
      // width: "100%",
      marginHorizontal: 10,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
    },
    ratingText: {
      marginLeft: 5,
      fontSize: 12,
      fontFamily: "jakarta-sans-medium",
    },
  });

  // const paymentMethod = [
  //   {
  //     id: 1,
  //     name: "Pay on Delivery",
  //     icon: (
  //       <MaterialIcons
  //         style={{ marginRight: 4 }}
  //         name="delivery-dining"
  //         size={24}
  //         color={theme.colors.primary}
  //       />
  //     ),
  //   },
  // ];
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  // const getTotalAmount = useCartStore((state) => state.getTotalAmount);
  // const getTotalSavings = useCartStore((state) => state.getTotalSavings);
  // const setCartItem = useCartStore((state) => state.setCartItem);
  // const setChangeAddressModalOpen = useModalStore(
  //   (state) => state.setChangeAddressModalOpen
  // );
  // const setAllAddresses = useAddressStore((state) => state.setAllAddresses);
  // const setAddress = useAddressStore((state) => state.setAddress);
  // const allAddresses = useAddressStore((state) => state.allAddresses);
  // const address = useAddressStore((state) => state.address);
  // const newOrderDetails = useOrderStore((state) => state.newOrderDetails);
  // const setNewOrderDetails = useOrderStore((state) => state.setNewOrderDetails);
  // const boolAddressSelected = (address.id ? address.id.length : 0) > 0;
  // const boolHasSavedAddresses = allAddresses.length > 0;
  // const [cartItemsLoading, setCartItemsLoading] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  // const [orderButtonDisabled, setOrderButtonDisabled] = useState(true);
  const setHoverCartInfo = useCartStore((state) => state.setCartHoverInfo);
  // const setHoverCartVisible = useModalStore((state) => state.setHoverCartInfo);
  // const hoverOrderCardVisible = useModalStore((state) => state.hoverOrderInfo);
  const [cartButtonText, setcartButtonText] = useState("Add");
  const [menuItemDataLoading, setMenuItemDataLoading] = useState(true);
  const [menuItemData, setMenuItemData] = useState<FoodItemProps>({
    id: "",
    name: "",
    images: [],
    rating: 0,
    sellingPrice: 0,
    markedPrice: 0,
    discount: 0,
    cuisineType: "",
    variant: "",
    restaurantId: "",
  });
  const getMenuItem = useMenuStore((state) => state.getMenuItem);
  const addToCart = useCartStore((state) => state.addToCart);
  const setHoverCardVisble = useModalStore((state) => state.setHoverCartInfo);
  const setCartModalIsOpen = useModalStore(
    (state) => state.setAddToCartModalOpen
  );
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

  const [orderSuccessVisible, setOrderSuccessVisible] = useState(false);

  useEffect(() => {
    (async () => {
      setMenuItemDataLoading(true);
      const response = await fetch(`${api}/menu/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ menuItemId: id }),
      });
      const data = await response.json();
      setMenuItemData(data[0]);
      setMenuItemDataLoading(false);
    })();
  }, []);

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    const response = await fetch(`${api}/cart/update-quantity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ itemId: id, quantity }),
    });
    if (response.status === 200) updateQuantity(id, quantity);
  };
  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  async function handleAddToCart() {
    if (cartButtonText !== "Add") return;
    if (!(user.token.length > 0)) {
      router.push("/login");
      return;
    }
    if (menuItemData.variant === "parent") {
      setCartModalIsOpen(true);
    } else {
      try {
        setAddToCartLoading(true);
        const menuItemId = id;
        const exists = checkExisting(menuItemId as string, []);
        const cartItem = cartItems.find(
          (item) => item.menuItemId === menuItemId
        );

        if (exists) {
          handleUpdateQuantity(cartItem?.id!, cartItem?.quantity! + 1);
          setcartButtonText("Added 🎉");
          setHoverCardVisble(true);
          setAddToCartLoading(false);
          return;
        }
        const response = await fetch(`${api}/cart/add-to-cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            menuItemId: id,
            addOns: [],
          }),
        });
        const responseData = await response.json();
        const cartItemParams = {
          id: responseData[0].id as string,
          name: menuItemData?.name!,
          menuItemId: responseData[0].menuItemId as string,
          restaurantId: responseData[0].restaurantId,
          markedPrice: menuItemData?.markedPrice!,
          sellingPrice: responseData[0].finalPrice!,
          cuisineType: menuItemData?.cuisineType! as string,
          discount: menuItemData?.discount! as number,
          quantity: responseData[0].quantity! as number,
          // category: menuItemData?.category!,
          addOns: [],
        };
        addToCart(cartItemParams);
        setHoverCartInfo(cartItemParams, ++cartItems.length);
        setcartButtonText("Added 🎉");
        setHoverCardVisble(true);
        setAddToCartLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
  }

  if (!(user.token.length > 0)) {
    return <Redirect href={"/login"} />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Pressable
          style={{
            marginLeft: 12,
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            router.back();
          }}
        >
          <Entypo
            name="chevron-thin-left"
            size={24}
            color={theme.colors.primary}
          />
          <Text
            style={{
              fontFamily: "jakarta-sans-medium",
              fontSize: 20,
              color: theme.colors.primary,
              marginBottom: 4,
              marginLeft: 2,
            }}
          >
            Back
          </Text>
        </Pressable>
        {menuItemDataLoading ? (
          <View style={styles.skeletonContainer}>
            <Skeleton
              animation="pulse"
              height={280}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={40}
              style={styles.skeletonStructure}
              skeletonStyle={{
                ...styles.skeleton,
                marginLeft: 10,
                borderRadius: 6,
                width: 240,
              }}
            />
            <Skeleton
              animation="pulse"
              height={95}
              style={styles.skeletonStructure}
              skeletonStyle={{
                ...styles.skeleton,
                marginHorizontal: 10,
                borderRadius: 6,
                width: "95%",
              }}
            />
          </View>
        ) : (
          <View>
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
                    source={{
                      uri: image,
                    }}
                    style={styles.image}
                    PlaceholderContent={<Text>Loading...</Text>}
                  />
                ))}
              </ScrollView>
              <View style={styles.pagination}>
                {menuItemData.images?.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === activeIndex ? styles.paginationDotActive : null,
                    ]}
                  />
                ))}
              </View>
            </View>
            <View
              style={{
                margin: 10,
                // flexDirection: "column",
                // justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={styles.name}>{menuItemData?.name}</Text>
                <Text style={styles.description}>
                  {menuItemData?.description}
                </Text>
                <View style={styles.ratingContainer}>
                  <Rating
                    type="star"
                    ratingCount={5.0}
                    fractions={1}
                    imageSize={24}
                    startingValue={menuItemData?.rating}
                    readonly={true}
                    showReadOnlyText={false}
                    ratingBackgroundColor="#E8D6AE"
                  />
                  {/* <Text style={styles.ratingText}>10 Ratings</Text> */}
                </View>
              </View>
            </View>
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
      <AddToCartModal menuItemData={menuItemData} />
    </SafeAreaView>
  );
}
