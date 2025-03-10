import React, { useEffect, useState } from "react";
import { Platform, View, ScrollView, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import Header from "@/components/Header";
import { Text, Button, Skeleton } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderSuccessMessage from "@/components/OrderSuccessMessage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { api } from "@/constants/api";
import HoverCardOrderInfo from "@/components/HoverCardOrderInfo";
import CartListItem from "@/components/CartListItem";
import DeliveryInfoCard from "@/components/DeliveryInfoCard";
import ChangeAddressModal from "@/components/ChangeAddressModal";
import useUserStore from "../store/userStore";
import useCartStore from "../store/cartStore";
import useAddressStore from "@/store/addressStore";
import useOrderStore from "@/store/orderStore";
import { CartItem } from "@/types";
import { Link } from "expo-router";
import useModalStore from "@/store/modalsStore";
import { AddressType } from "../types";
import { useRouter, Redirect } from "expo-router";
import { restaurantId } from "@/constants/restaurantInfo";
import { Image } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import useMenuStore from "@/store/menuStore";
import { FoodItemProps } from "@/types";
import AddToCartModal from "@/components/AddToCartModal";
import { checkArrayValueEquality } from "@/utils";
export default function CartsPage() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    imageContainer: {
      // width: IMAGE_WIDTH,
      height: "38%",
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      overflow: "hidden",
    },
    image: {
      width: 800,
      height: 500,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
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
      width: "100%",
    },
  });

  const paymentMethod = [
    {
      id: 1,
      name: "Pay on Delivery",
      icon: (
        <MaterialIcons
          style={{ marginRight: 4 }}
          name="delivery-dining"
          size={24}
          color={theme.colors.primary}
        />
      ),
    },
  ];
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);
  const getTotalSavings = useCartStore((state) => state.getTotalSavings);
  const setCartItem = useCartStore((state) => state.setCartItem);
  const setChangeAddressModalOpen = useModalStore(
    (state) => state.setChangeAddressModalOpen
  );
  const setAllAddresses = useAddressStore((state) => state.setAllAddresses);
  const setAddress = useAddressStore((state) => state.setAddress);
  const allAddresses = useAddressStore((state) => state.allAddresses);
  const address = useAddressStore((state) => state.address);
  const newOrderDetails = useOrderStore((state) => state.newOrderDetails);
  const setNewOrderDetails = useOrderStore((state) => state.setNewOrderDetails);
  const boolAddressSelected = (address.id ? address.id.length : 0) > 0;
  const boolHasSavedAddresses = allAddresses.length > 0;
  const [cartItemsLoading, setCartItemsLoading] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const [orderButtonDisabled, setOrderButtonDisabled] = useState(true);
  const setHoverCartInfo = useCartStore((state) => state.setCartHoverInfo);
  const setHoverCartVisible = useModalStore((state) => state.setHoverCartInfo);
  const hoverOrderCardVisible = useModalStore((state) => state.hoverOrderInfo);
  const [cartButtonText, setcartButtonText] = useState("Add");
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
  //   const cartItems = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  //   const setHoverCartInfo = useCartStore((state) => state.setCartHoverInfo);
  //   const updateQuantity = useCartStore((state) => state.updateQuantity);
  const setHoverCardVisble = useModalStore((state) => state.setHoverCartInfo);
  const setCartModalIsOpen = useModalStore(
    (state) => state.setAddToCartModalOpen
  );
  const menuItem = getMenuItem(id as string);
  const setHoverOrderCardVisible = useModalStore(
    (state) => state.setHoverOrderInfo
  );
  const setOrders = useOrderStore((state) => state.setOrders);
  const [activeIndex, setActiveIndex] = useState(0);

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
  if (!(user.token.length > 0)) {
    return <Redirect href={"/login"} />;
  }
  const [orderSuccessVisible, setOrderSuccessVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch(`${api}/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ menuItemId: id }),
      });
      const data = await response.json();
      console.log(data);
      //   setMenuItemData(data)
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
      //   setMenuItemData({
      //     id,
      //     name,
      //     images,
      //     markedPrice,
      //     discount,
      //     sellingPrice,
      //     cuisineType,
      //     description,
      //     variant,
      //   });
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
          id: responseData[0].id,
          name: menuItem?.name!,
          menuItemId: responseData[0].menuItemId,
          restaurantId,
          markedPrice: menuItem?.markedPrice!,
          sellingPrice: responseData[0].finalPrice!,
          cuisineType: menuItem?.cuisineType!,
          discount: menuItem?.discount!,
          quantity: responseData[0].quantity!,
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

  const images: string[] = [
    "https://www.fsiblog3.club/wp-content/uploads/2016/08/naked-indian-desi-shaved-chut.jpg",
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {images?.map((image, index) => (
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
          {images?.map((_, index) => (
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
      <View style={{ margin: 10 }}>
        <Text style={styles.name}>{menuItem?.name}</Text>
        <Text style={styles.description}>
            {menuItem?.description}
        </Text>
        
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
      </View>
      <AddToCartModal menuItemData={menuItemData} />
    </SafeAreaView>
  );
}
