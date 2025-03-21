import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@rneui/themed";
import { Card } from "@rneui/themed";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import useUserStore from "@/store/userStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { Skeleton } from "@rneui/base";
import useAddressStore from "@/store/addressStore";
import Feather from "@expo/vector-icons/Feather";
import { api } from "../constants/api";
import useOrderStore from "@/store/orderStore";
import { AddressType } from "@/types";
import { ScrollView } from "react-native";

const AddressList = ({
  allAddresses,
}: {
  allAddresses: AddressType[] | [];
}) => {
  const { theme } = useTheme();
  const { token } = useUserStore((state) => state.user);
  const styles = StyleSheet.create({
    addressText: {
      fontFamily: "jakarta-sans-medium",
      color: theme.colors.grey0,
      fontSize: 12.5,
    },
  });
  const setAddress = useAddressStore((state) => state.setAddress);
  const setOrderDetails = useOrderStore((state) => state.setNewOrderDetails);
  async function handleSelectAddress(address: AddressType) {
    const response = await fetch(`${api}/address/update-selected-address`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ addressId: address.id }),
    });
    const responseData = await response.json();
    if (responseData.data) {
      setAddress(address);
      setOrderDetails({ address: address.id });
    }
  }
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
      {allAddresses?.map((item, index) => {
        return (
          <Card
            key={index}
            containerStyle={{
              marginHorizontal: 0,
              borderRadius: 8,
              marginVertical: 8,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontFamily: "jakarta-sans-medium",
                  fontSize: 14,
                  color: theme.colors.primary,
                }}
              >
                {item.type === "Home" && (
                  <AntDesign
                    name="home"
                    size={18}
                    color={theme.colors.primary}
                  />
                )}
                {item.type === "Office" && (
                  <Feather
                    name="briefcase"
                    size={18}
                    color={theme.colors.primary}
                  />
                )}
                {"  "}
                {item.type}
              </Text>
              {/* <Button
                disabled={address.id === item.id ? true : false}
                title={address.id === item.id ? "selected" : "select"}
                type="outline"
                containerStyle={{ borderColor: theme.colors.primary }}
                buttonStyle={{
                  paddingHorizontal: 8,
                  paddingBottom: 4,
                  paddingTop: 3,
                  borderWidth: 0.6,
                }}
                titleStyle={{ color: theme.colors.primary }}
              /> */}
            </View>
            <View style={{ marginTop: 6 }}>
              <Text style={styles.addressText}>
                {item.address_line_1}, {item.address_line_2}
              </Text>
              <Text style={styles.addressText}>
                {item.state}, {item.city}
              </Text>
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
};
const OrderStatus = () => {
  const { theme } = useTheme();
  const allAddresses = useAddressStore((state) => state.allAddresses);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setOrders = useOrderStore((state) => state.setOrders);
  const orders = useOrderStore((state) => state.orders);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const setAllAddresses = useAddressStore((state) => state.setAllAddresses);

  useEffect(() => {
    (async () => {
      try {
        setAddressesLoading(true);
        const response = await fetch(`${api}/address/get-addresses`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const responseData = await response.json();
        setAllAddresses(responseData.data);
        setAddressesLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    openButton: {
      padding: 15,
      backgroundColor: "#673ab7",
      borderRadius: 10,
    },
    openButtonText: {
      color: "#fff",
      fontSize: 18,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      height: 600,
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    closeButton: {
      alignSelf: "flex-end",
    },
    modalText: {
      textAlign: "center",
      fontSize: 18,
      marginTop: 20,
    },
    itemDetailContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    imageAndTextContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    image: {
      width: 70,
      height: 70,
      borderRadius: 10,
    },
    optionsCardContainer: {
      borderRadius: 8,
      marginHorizontal: 0,
    },
    optionsContainer: {
      flexDirection: "column",
    },
    //button
    cartButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      // marginVertical: 8,
    },
    cartButtonTitle: {
      fontSize: 16,
    },
    cartButtonContainer: {
      borderRadius: 4,
      paddingVertical: 8,
      width: "100%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 16,
    },
    addresssButton: {
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: 0,
      width: "100%",
    },
    skeletonContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
      marginTop: 10,
    },
    skeletonStructure: {
      backgroundColor: "#FFFFF",
      borderRadius: 8,
    },
    skeleton: {
      backgroundColor: "#EDEDED",
    },
  });
  const cuisineType = "veg";
  useEffect(() => {
    (async () => {
      const response = await fetch(`${api}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setOrders(data);
    })();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 12, marginHorizontal: 10 }}
      >
        <View style={{ marginTop: 12 }}>
          {allAddresses.length > 0 && (
            <Text style={{ fontFamily: "jakarta-sans-semibold", fontSize: 16 }}>
              Saved Addresses
            </Text>
          )}
        </View>
        {addressesLoading ? (
          <View style={styles.skeletonContainer}>
            <Skeleton
              animation="pulse"
              height={110}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={110}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={110}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
          </View>
        ) : (
          <AddressList allAddresses={allAddresses} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderStatus;
