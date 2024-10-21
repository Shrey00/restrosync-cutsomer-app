import { Text, View } from "react-native";
import Header from "@/components/Header";
import SearchBar from "@/components/Search";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@rneui/themed";
import SlideLinkCardSection from "@/components/SlideLinkCardSection";
import { Button } from "@rneui/themed";
import Categories from "@/components/Categories";
import useUserStore from "../../store/userStore";
export default function Index() {
  const { theme } = useTheme();
  const user = useUserStore((state) => state.user);
  const styles = StyleSheet.create({});
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <Header user={user} showSearch={true} />
      {/* <SearchBar /> */}
      <SlideLinkCardSection
        heading="Offer Zone"
        link={{ text: "Explore", link: "/offers" }}
        cardData={[
          {
            text: "Upto 20% Off in all Burgers",
            link: "/offers",
            image:
              "https://thumbs.dreamstime.com/b/food-photography-epic-cheeseburger-flying-ingredients-splashing-dripping-sauce-dark-background-advertising-313260294.jpg",
          },
        ]}
      />
      <SlideLinkCardSection
        heading="Must Try"
        link={{ text: "Explore", link: "/offers" }}
        cardData={[
          {
            text: "This is It",
            link: "/offers",
            image:
              "https://thumbs.dreamstime.com/b/food-photography-epic-cheeseburger-flying-ingredients-splashing-dripping-sauce-dark-background-advertising-313260294.jpg",
          },
        ]}
      />
      <Categories />
    </SafeAreaView>
  );
}
