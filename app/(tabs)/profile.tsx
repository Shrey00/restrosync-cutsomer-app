import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Alert,
  Share,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Card, ListItem, Dialog } from "@rneui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { deleteKey } from "@/utils";
import useUserStore from "../../store/userStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter, Link } from "expo-router";
// import {} from 'react-native';
export default function Profile() {
  const { theme } = useTheme();
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
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
      width: "auto",
    },
  });

  // Function to handle the share action
  const handleShare = async () => {
    try {
      const result = await Share.share(
        {
          message:
            "Check out this amazing app! Download it here: https://play.google.com/store/apps/details?id=com.zyptec.eatsinn",
          title: "Share this app",
          url: "https://play.google.com/store/apps/details?id=com.zyptec.eatsinn", // Optional: some platforms support direct URLs
        },
        {
          dialogTitle: "Share Eatsinn!",
        }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type:", result.activityType);
        } else {
          console.log("App shared successfully!");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing the app:", error);
      Alert.alert("Oops!", "An error occurred while trying to share the app.");
    }
  };

  useEffect(() => {
    if (!user.token) {
      router.replace("/login");
    }
    setLoading(false);
  }, [router, user.token]);
  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };
  const handleLogout = async () => {
    setDeleteLoading(true);
    await deleteKey("token");
    router.replace("/login");
    setDeleteLoading(false);
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      {!loading && (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
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
            <Pressable onPress={() => router.push("/profile-settings")}>
              <ListItem containerStyle={styles.listItem}>
                <AntDesign name="user" size={20} color={theme.colors.primary} />
                <ListItem.Content>
                  <ListItem.Title>Profile Details & Settings</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </Pressable>
            <Pressable onPress={() => router.push("/address")}>
              <ListItem containerStyle={styles.listItem}>
                <Entypo name="address" size={24} color={theme.colors.primary} />
                <ListItem.Content>
                  <ListItem.Title>Addresses</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </Pressable>
            <Pressable onPress={() => router.push("/orders")}>
              <ListItem containerStyle={styles.listItem}>
                <Feather name="list" size={24} color={theme.colors.primary} />
                <ListItem.Content>
                  <ListItem.Title>Orders</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </Pressable>
            <Pressable>
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
            </Pressable>
            <Pressable onPress={handleShare}>
              <ListItem containerStyle={styles.listItem}>
                <AntDesign
                  name="sharealt"
                  size={24}
                  color={theme.colors.primary}
                />
                <ListItem.Content>
                  <ListItem.Title>Share App</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </Pressable>

            <Link href="/terms-conditions">
              <ListItem containerStyle={styles.listItem}>
                <Entypo
                  name="open-book"
                  size={24}
                  color={theme.colors.primary}
                />
                <ListItem.Content>
                  <ListItem.Title>Terms & Conditions</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </Link>
            {/* <ListItem containerStyle={styles.listItem}>
              <AntDesign name="Safety" size={24} color={theme.colors.primary} />
              <ListItem.Content>
                <ListItem.Title>Privacy Policy</ListItem.Title>
              </ListItem.Content>
            </ListItem> */}
            <ListItem
              containerStyle={{ ...styles.listItem, borderBottomWidth: 0 }}
              onPress={toggleLogoutModal}
            >
              <Feather name="log-out" size={24} color={theme.colors.primary} />
              <ListItem.Content>
                <ListItem.Title>Logout</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          </Card>
        </ScrollView>
      )}
      <Dialog
        isVisible={showLogoutModal}
        onBackdropPress={toggleLogoutModal}
        overlayStyle={{ borderRadius: 8 }}
      >
        <Dialog.Title
          title="Logout"
          titleStyle={{ fontFamily: "jakarta-sans-semibold", fontSize: 16 }}
        />
        <Text style={{ fontFamily: "jakarta-sans-medium" }}>
          Are you sure you want to logout from the app?
        </Text>
        {deleteLoading ? (
          <Dialog.Loading />
        ) : (
          <Dialog.Actions>
            <Dialog.Button title="Yes" onPress={handleLogout} />
            <Dialog.Button
              title="No"
              onPress={() => setShowLogoutModal(false)}
            />
          </Dialog.Actions>
        )}
      </Dialog>
    </SafeAreaView>
  );
}
