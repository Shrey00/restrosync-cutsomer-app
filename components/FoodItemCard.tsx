import React, { useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Card, Text, Image, Button } from "@rneui/themed";
import VegIcon from "../assets/veg-icon.svg";
import NonVegIcon from "../assets/non-veg-icon.svg";
import { Rating } from "react-native-ratings";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { api } from "@/constants/api";
import useCartStore from "@/store/cartStore";
import { FoodItemProps } from "@/types";
import useModalStore from "@/store/modalsStore";
import { useRouter } from "expo-router";
import { checkArrayValueEquality } from "../utils";
import useUserStore from "@/store/userStore";
import { Pressable } from "react-native";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 20;
const IMAGE_WIDTH = CARD_WIDTH * 0.4;

export default function FoodItemCard({
  id,
  name,
  images,
  rating,
  markedPrice,
  discount,
  sellingPrice,
  cuisineType,
  description,
  restaurantId,
  variant,
  user,
}: FoodItemProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [cartButtonText, setcartButtonText] = useState("Add");
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const setHoverCartInfo = useCartStore((state) => state.setCartHoverInfo);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const setSelectedMenuItemData = useCartStore(
    (state) => state.setSelectedMenuItemData
  );
  const setHoverCardVisble = useModalStore((state) => state.setHoverCartInfo);
  const token = useUserStore((state) => state.user.token);
  // const hoverCardVisble = useModalStore((state) => state.hoverCartInfo);
  // const setCartModalIsOpen = useModalStore(
  //   (state) => state.setAddToCartModalOpen
  // );
  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };
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
  async function handleAddToCart() {
    if (cartButtonText !== "Add") return;
    if (!(user.token.length > 0)) {
      router.push("/login");
      return;
    }
    if (variant === "parent") {
      setSelectedMenuItemData({
        id,
        name,
        images,
        markedPrice,
        discount,
        sellingPrice,
        cuisineType,
        description,
        variant,
        rating,
        restaurantId,
      });
      // setCartModalIsOpen(true);
      router.push("/add-to-cart-modal");
    } else {
      try {
        setAddToCartLoading(true);
        const menuItemId = id;
        const exists = checkExisting(menuItemId, []);
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
          name: name,
          menuItemId: responseData[0].menuItemId,
          restaurantId,
          markedPrice,
          sellingPrice: responseData[0].finalPrice,
          cuisineType,
          discount,
          quantity: responseData[0].quantity,
          addOns: [],
        };
        addToCart(cartItemParams);
        setHoverCartInfo(cartItemParams, ++cartItems.length);
        setcartButtonText("Added 🎉");
        setHoverCardVisble(true);
        setAddToCartLoading(false);
        setcartButtonText("Added 🎉");
      } catch (e) {
        console.log(e);
      }
    }
  }
  return (
    <Card containerStyle={styles.card}>
      <View style={styles.container}>
        <Pressable
          style={styles.detailsContainer}
          onPress={() => router.push(`/food-detail?id=${id}`)}
        >
          <View>
            <View style={styles.cuisineInfoContainer}>
              {cuisineType === "veg" ? (
                <VegIcon width={18} height={18} />
              ) : (
                <NonVegIcon width={18} height={18} />
              )}
            </View>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.ratingContainer}>
              <Rating
                type="star"
                ratingCount={5.0}
                fractions={1}
                imageSize={16}
                startingValue={rating}
                readonly={true}
                showReadOnlyText={false}
                ratingBackgroundColor="#E8D6AE"
              />
              {/* <Text style={styles.ratingText}>10 Ratings</Text> */}
            </View>
            <Text style={styles.price}>{"₹" + sellingPrice}</Text>
            <Text style={styles.description} numberOfLines={3}>
              {description}
            </Text>
          </View>
        </Pressable>
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
                aria-label={"image of " + name}
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
          <Button
            title={cartButtonText}
            icon={
              cartButtonText === "Add" && (
                <FontAwesome6
                  name="plus"
                  size={16}
                  color="#FDE4E8"
                  style={{ marginRight: 6 }}
                />
              )
            }
            loading={addToCartLoading}
            loadingStyle={{ borderBlockColor: "#FDE4E8" }}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            onPress={handleAddToCart}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 0,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 1,
  },
  container: {
    flexDirection: "row",
  },
  cuisineInfoContainer: {
    marginBottom: 5,
    flexDirection: "row",
    gap: 4,
  },
  detailsContainer: {
    flex: 1,
    padding: 15,
  },
  name: {
    marginBottom: 5,
    fontFamily: "jakarta-sans-semibold",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    fontFamily: "jakarta-sans-medium",
  },
  price: {
    fontSize: 12,
    fontFamily: "jakarta-sans-semibold",
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: "#666",
  },
  imageContainer: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH * 1.2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH * 1.2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
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
  buttonContainer: {
    position: "absolute",
    bottom: 0,
  },
  button: {
    borderRadius: 0,
    paddingVertical: 4,
    paddingHorizontal: 24,
    width: IMAGE_WIDTH,
    height: 45,
  },
  buttonTitle: {
    fontFamily: "jakarta-sans-semibold",
    marginBottom: 3,
  },
});
