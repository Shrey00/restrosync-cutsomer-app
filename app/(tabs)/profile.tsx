import { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Avatar, Card, ListItem } from "@rneui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { restaurantId } from "@/constants/restaurantInfo";
import { api } from "@/constants/api";
import { Skeleton } from "@rneui/themed";
import Header from "@/components/Header";
import FoodItemCard from "@/components/FoodItemCard";
import useMenuStore from "../../store/menuStore";
import useUserStore from "../../store/userStore";
import { FoodItemProps } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useRouter} from "expo-router";
export default function profile() {
  const { theme } = useTheme();
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const styles = StyleSheet.create({
    cardContainer: {
      borderRadius: 8,
      marginHorizontal: 10,
      marginTop: 0,
      marginBottom: 10,
      paddingHorizontal: 20,
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
    },
    skeleton: {
      backgroundColor: "#EDEDED",
    },
    profileIntroContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    greetingsText: {
      fontFamily: "jakarta-sans-medium",
      fontSize: 18,
    },
    contactText: {
      fontFamily: "jakarta-sans-regular",
    },
    listItem: {
      paddingVertical: 16,
      paddingHorizontal: 0,
      backgroundColor: theme.colors.white,
      borderBottomWidth: 1,
      borderColor: "#EDEDED",
    },
  });
  router.push("/order-status")
  const { token } = useUserStore((state) => state.user);

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <ScrollView>
        <Card containerStyle={{ ...styles.cardContainer, marginTop: 10 }}>
          <View style={styles.profileIntroContainer}>
            <MaterialIcons
              name="account-circle"
              size={85}
              color={theme.colors.primary}
            />
            <View>
              <Text style={styles.greetingsText}>Hi,{user.firstName}!</Text>
              <Text style={styles.contactText}>
                {user.countryCode} {user.contact}
              </Text>
            </View>
          </View>
        </Card>
        <Card containerStyle={styles.cardContainer}>
          <ListItem containerStyle={styles.listItem}>
            <AntDesign name="user" size={20} color={theme.colors.primary} />
            <ListItem.Content>
              <ListItem.Title>Profile Details</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem containerStyle={styles.listItem}>
            <Entypo name="address" size={24} color={theme.colors.primary} />
            <ListItem.Content>
              <ListItem.Title>Addresses</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem containerStyle={styles.listItem}>
            <Feather name="list" size={24} color={theme.colors.primary} />
            <ListItem.Content>
              <ListItem.Title>Orders</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem containerStyle={styles.listItem}>
            <Entypo
              name="star-outlined"
              size={24}
              color={theme.colors.primary}
            />
            <ListItem.Content>
              <ListItem.Title>Rate Us</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem containerStyle={styles.listItem}>
            <AntDesign name="sharealt" size={24} color={theme.colors.primary} />
            <ListItem.Content>
              <ListItem.Title>Share App</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem containerStyle={styles.listItem}>
            <Entypo name="open-book" size={24} color={theme.colors.primary} />
            <ListItem.Content>
              <ListItem.Title>Terms & Conditions</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem containerStyle={styles.listItem}>
            <AntDesign name="Safety" size={24} color={theme.colors.primary} />
            <ListItem.Content>
              <ListItem.Title>Privacy Policy</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem
            containerStyle={{ ...styles.listItem, borderBottomWidth: 0 }}
          >
            <Feather name="log-out" size={24} color={theme.colors.primary} />
            <ListItem.Content>
              <ListItem.Title>Logout</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
