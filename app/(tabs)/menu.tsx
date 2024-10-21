import { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@rneui/themed";
import { restaurantId } from "@/constants/restaurantInfo";
import { api } from "@/constants/api";
import { Skeleton } from "@rneui/themed";
import Header from "@/components/Header";
import FoodItemCard from "@/components/FoodItemCard";
import useMenuStore from "../../store/menuStore";
import useUserStore from "../../store/userStore";
import { getViewProp } from "react-native-reanimated";
import { getValueFor } from "@/utils";
import AddToCartModal from "@/components/AddToCartModal";
import ItemOptionsOverlay from "@/components/ItemOptionsOverlay";
import { FoodItemProps } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 20;
export default function menu() {
  const { theme } = useTheme();
  const user = useUserStore((state) => state.user);
  const uri =
    "https://thumbs.dreamstime.com/b/food-photography-epic-cheeseburger-flying-ingredients-splashing-dripping-sauce-dark-background-advertising-313260294.jpg";
  const styles = StyleSheet.create({
    skeletonContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
    },
    skeletonStructure: {
      backgroundColor: "#FFFFF",
      borderRadius: 8,
    },
    skeleton: {
      backgroundColor: "#EDEDED",
    },
  });
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);
  const { token } = useUserStore((state) => state.user);
  const menu = useMenuStore((state) => state.menu);
  const setMenu = useMenuStore((state) => state.setMenu);

  const [cartModalVisible, setCartModalVisible] = useState(false);
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
  });
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${api}/menu/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ restaurantId }),
        });
        const responseData = await response.json();
        setMenu(responseData.data);
        setLoadingMenuItems(false);
      } catch (error) {
        console.log(error);
      }
      // }
    })();
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <Header user={user} showSearch={true} />
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        {loadingMenuItems ? (
          <View style={styles.skeletonContainer}>
            <Skeleton
              animation="pulse"
              width={CARD_WIDTH}
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              width={CARD_WIDTH}
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              width={CARD_WIDTH}
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              width={CARD_WIDTH}
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              width={CARD_WIDTH}
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
          </View>
        ) : (
          menu?.map((item, index) => {
            return (
              <View key={index}>
                <FoodItemCard
                  id={item.id}
                  name={item.name}
                  images={item.images}
                  rating={item.rating}
                  cuisineType={item.cuisineType}
                  markedPrice={item.markedPrice}
                  sellingPrice={item.sellingPrice}
                  discount={item.discount}
                  description={item.description}
                  variant={item.variant}
                  user={user}
                  setCartModalVisible={setCartModalVisible}
                  setMenuItemData={setMenuItemData}
                />
              </View>
            );
          })
        )}
      </ScrollView>
      {/* <ItemOptionsOverlay visible={addToCartOptionsVisible} /> */}
      <AddToCartModal
        menuItemData={menuItemData}
        modalVisible={cartModalVisible}
        setModalVisible={setCartModalVisible} 
      />
    </SafeAreaView>
  );
}
