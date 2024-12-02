import { Text, View } from "react-native";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/Search";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@rneui/themed";
import SlideLinkCardSection from "@/components/SlideLinkCardSection";
import AddAddressModal from "@/components/AddAddressModal";
import { Button } from "@rneui/themed";
import Categories from "@/components/Categories";
import useUserStore from "../../store/userStore";
import { softwareId, api } from "@/constants/api";
import { useRouter } from "expo-router";
export default function Index() {
  const { theme } = useTheme();
  const user = useUserStore((state) => state.user);
  const styles = StyleSheet.create({});
  const [restaurantsState, setRestaurantsState] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
  
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <Header user={user} showSearch={true} />

      <SlideLinkCardSection
        heading="Restaurants"
        link={{ text: "", link: "/" }}
        sectionType="brands"
        cardData={restaurantsState}
        loading={loading}
      />

      <SlideLinkCardSection
        heading="Must Try"
        link={{ text: "Explore", link: "/offers" }}
        sectionType="offers"
        cardData={[]}
        loading={loading}
      />
      <Categories />
      <AddAddressModal />
    </SafeAreaView>
  );
}
