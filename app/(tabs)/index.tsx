import { Text, View } from "react-native";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/Search";
import { ScrollView, StyleSheet } from "react-native";
import { renderItem } from "@/utils/renderItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@rneui/themed";
import SlideLinkCardSection from "@/components/SlideLinkCardSection";
import AddAddressModal from "@/components/AddAddressModal";
import Categories from "@/components/Categories";
import useUserStore from "../../store/userStore";
import { softwareId, api } from "@/constants/api";
import { useRouter } from "expo-router";
import useModalStore from "@/store/modalsStore";
import HoverCardOrderInfo from "@/components/HoverCardOrderInfo";
import useOrderStore from "@/store/orderStore";
import RatingModal from "@/components/RatingModal";
export default function Index() {
  const { theme } = useTheme();
  const user = useUserStore((state) => state.user);
  const styles = StyleSheet.create({});
  const [restaurantsState, setRestaurantsState] = useState([]);
  const [mustTryItems, setMustTryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const hoverOrderCardVisible = useModalStore((state) => state.hoverOrderInfo);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const setHoverOrderCardVisible = useModalStore(
    (state) => state.setHoverOrderInfo
  );
  const setOrders = useOrderStore((state) => state.setOrders);
  const orders = useOrderStore((state) => state.orders);
  const fetchLatestOrders = async () => {
    const response = await fetch(`${api}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();
    setOrders(data);
    if (data.length > 0) setHoverOrderCardVisible(true);
  };
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${api}/restaurants/list/${softwareId}`);
        const responseData = await response.json();
        setRestaurantsState(responseData);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        await fetchLatestOrders();
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${api}/menu/popular-items/${softwareId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = await response.json();
        setMustTryItems(data);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  const defaultDataWith6Colors = [
    "#B0604D",
    "#899F9C",
    "#B3C680",
    "#5C6265",
    "#F5D399",
    "#F1F1F1",
  ];
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <Header user={user} showSearch={true} />

      {/* <View
        style={{
          marginHorizontal: 10,
          borderRadius: 8,
          height: 200,
          backgroundColor: theme.colors.primary,}}
      >

      </View> */}
      <View
        id="carousel-component"
        // dataSet={{ kind: "basic-layouts", name: "left-align" }}
      >
        {/* <Carousel
          loop={true}
          width={430}
          height={258}
          snapEnabled={true}
          pagingEnabled={true}
          autoPlayInterval={2000}
          data={defaultDataWith6Colors}
          style={{ width: "100%" }}
          onSnapToItem={(index : number) => console.log("current index:", index)}
          renderItem={renderItem({ rounded: true, style: { marginRight: 8 } })}
        /> */}
      </View>
      <SlideLinkCardSection
        heading="Restaurants"
        link={{ text: "", link: "/" }}
        sectionType="brands"
        cardData={restaurantsState}
        loading={loading}
      />

      <SlideLinkCardSection
        heading="Must Try"
        link={{ text: "", link: "/" }}
        sectionType="popular"
        cardData={mustTryItems}
        loading={loading}
      />
      <Categories />
      <AddAddressModal />
      <HoverCardOrderInfo
        isVisible={hoverOrderCardVisible}
        setIsVisible={setHoverOrderCardVisible}
      />
      {/* <RatingModal isOpen={true} setIsOpen={setIsRatingModalOpen}/> */}
    </SafeAreaView>
  );
}
