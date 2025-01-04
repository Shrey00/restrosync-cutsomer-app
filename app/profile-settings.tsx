import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Text,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Avatar, Card, ListItem, Dialog } from "@rneui/themed";
import { Button } from "@rneui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { restaurantId } from "@/constants/restaurantInfo";
import { api } from "@/constants/api";
import { Skeleton } from "@rneui/themed";
import Header from "@/components/Header";
import FoodItemCard from "@/components/FoodItemCard";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomInput from "@/components/ui/CustomInput";
import useMenuStore from "../store/menuStore";
import useUserStore from "../store/userStore";
import { FoodItemProps } from "@/types";
import { useRouter } from "expo-router";
export default function profile() {
  const { theme } = useTheme();
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [showDeletionConfirmModal, setShowDeletionConfirmModal] =
    useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleDeletion = async () => {
    setDeleteLoading(true);
    const response = await fetch(`${api}/delete-account`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    setDeleteLoading(false);
  };
  const toggleDeletionConfirmModal = () => {
    setShowDeletionConfirmModal(false);
  };
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
    addButtonDetails: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,

      height: 52,
      // width:"100%"
    },
    addButtonDetailsTitle: {
      fontSize: 16,
    },
    addButtonDetailsContainer: {
      borderRadius: 4,
      paddingVertical: 8,
      marginHorizontal: 10,
      position: "absolute",
      right: 0,
      left: 0,
      bottom: 0,
    },
  });
  // router.push("/profile-settings")
  // const { token } = useUserStore((state) => state.user);
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <Pressable
        style={{ marginLeft: 12, flexDirection: "row", alignItems: "center" }}
        onPress={() => {
          router.replace("/profile");
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
          Profile
        </Text>
      </Pressable>
      <View style={{ height: "100%" }}>
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
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <CustomInput
                label={"First Name"}
                value={user.firstName}
                width={"48.5%"}
                disabled
                disabledInputStyle={{ opacity: 1, color: theme.colors.grey1 }}
              />
              <CustomInput
                label={"Last Name"}
                value={user.lastName}
                width={"48.5%"}
                disabledInputStyle={{ opacity: 1, color: theme.colors.grey1 }}
                disabled
              />
            </View>
            {user.email && (
              <CustomInput
                placeholder="E-mail"
                disabledInputStyle={{ opacity: 1, color: theme.colors.grey1,lineHeight:16 }}
                disabled
                leftIcon={
                  <AntDesign
                    name="mail"
                    size={20}
                    color={theme.colors.primary}
                  />
                }
                value={user.email}
              />
            )}
            <CustomInput
              placeholder="Phone"
              // inputContainerStyle={{ borderWidth:1, borderColor:theme.colors.primary }}
              disabledInputStyle={{ opacity: 1, color: theme.colors.grey1,lineHeight:16 }}
              disabled
              leftIcon={
                <AntDesign
                  name="phone"
                  size={20}
                  color={theme.colors.primary}
                />
              }
              value={user.countryCode + " " + user.contact}
            />
          </View>
        </Card>
        <Card containerStyle={styles.cardContainer}>
          <Text
            style={{
              fontFamily: "jakarta-sans-semibold",
              marginBottom: 4,
              fontSize: 16,
            }}
          >
            Account Deletion
          </Text>
          <Text
            style={{
              fontFamily: "jakarta-sans-regular",
              fontStyle: "italic",
              fontSize: 14,
            }}
          >
            This will delete your account and all the data associated with the
            account. If you don't want that, you can logout, and you'll be able
            to come back any time.
          </Text>
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <Button
              title={"Delete Account"}
              buttonStyle={{ backgroundColor: "#BD2024" }}
              containerStyle={{ width: 150 }}
              onPress={() => setShowDeletionConfirmModal(true)}
            />
          </View>
        </Card>
      </View>
      <Dialog
        isVisible={showDeletionConfirmModal}
        onBackdropPress={toggleDeletionConfirmModal}
        overlayStyle={{ borderRadius: 8 }}
      >
        <Dialog.Title
          title="Account Deletion"
          titleStyle={{ fontFamily: "jakarta-sans-bold", fontSize: 16 }}
        />
        <Text>Are you sure you want to delete your account?</Text>
        {deleteLoading ? (
          <Dialog.Loading />
        ) : (
          <Dialog.Actions>
            <Dialog.Button title="Yes" onPress={() => handleDeletion()} />
            <Dialog.Button
              title="No"
              onPress={() => setShowDeletionConfirmModal(false)}
            />
          </Dialog.Actions>
        )}
      </Dialog>
    </SafeAreaView>
  );
}
