import { View } from "react-native";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@rneui/themed";
import SlideLinkCardSection from "@/components/SlideLinkCardSection";
// import AddAddressModal from "@/components/AddAddressModal";
import Categories from "@/components/Categories";
import useUserStore from "../../store/userStore";
import { softwareId, api } from "@/constants/api";
import useModalStore from "@/store/modalsStore";
import HoverCardOrderInfo from "@/components/HoverCardOrderInfo";
import useOrderStore from "@/store/orderStore";
export default function Index() {
  const { theme } = useTheme();
  const user = useUserStore((state) => state.user);
  const [restaurantsState, setRestaurantsState] = useState([]);
  const [mustTryItems, setMustTryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const hoverOrderCardVisible = useModalStore((state) => state.hoverOrderInfo);
  const setHoverOrderCardVisible = useModalStore(
    (state) => state.setHoverOrderInfo
  );
  const setOrders = useOrderStore((state) => state.setOrders);
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
        const response = await fetch(`${api}/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        setOrders(data);
        if (data.length > 0) setHoverOrderCardVisible(true);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [user.token]);
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
  }, [user.token]);
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <Header user={user} showSearch={true} />
      <View
        id="carousel-component"
      // dataSet={{ kind: "basic-layouts", name: "left-align" }}
      ></View>
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
      {/* <AddAddressModal /> */}
      <HoverCardOrderInfo
        isVisible={hoverOrderCardVisible}
        setIsVisible={setHoverOrderCardVisible}
      />
    </SafeAreaView>
  );
}
