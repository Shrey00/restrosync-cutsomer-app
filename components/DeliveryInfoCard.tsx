import { View, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import { Text, Button } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import useModalStore from "@/store/modalsStore";
import useAddressStore from "@/store/addressStore";
import useOrderStore from "@/store/orderStore";
import useUserStore from "@/store/userStore";
import useLocationStore from "@/store/locationStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { api } from "../constants/api";
import useCartStore from "@/store/cartStore";
import { Skeleton } from "@rneui/base";
const DeliveryInfoCard = ({
  boolAddressSelected,
  boolHasSavedAddresses,
  deliveryDetailLoading,
  deliveryDetails
}: {
  boolAddressSelected: boolean;
  boolHasSavedAddresses: boolean;
  deliveryDetailLoading: boolean,
  deliveryDetails: {
    distance: number,
    unit: string,
    deliveryAvailable: boolean,
    deliveryAmount: number,
    deliveryTime: number
  } | null
}) => {
  const { theme } = useTheme();
  // const cartItems = useCartStore((state) => state.cart)
  // const location = useLocationStore((state) => state.location);
  const router = useRouter();
  // const location = useLocationStore((state) => state.location);
  const styles = StyleSheet.create({
    cardContainer: {
      padding: 12,
      marginHorizontal: 10,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.008,
      shadowRadius: 4,
      elevation: 1, // For Android
    },
    deliveryCardRow: {
      flexDirection: "row",
      gap: 6,
      paddingBottom: 6,
      borderBottomWidth: 1,
      paddingVertical: 4,
      borderColor: theme.colors.grey5,
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

  function handleChangeAddressButton() {
    // setChangeAddressModalOpen(true);
    router.push("/change-address-modal");
  }
  const user = useUserStore((state) => state.user);
  const address = useAddressStore((state) => state.address);
  const deliveryNote = useOrderStore((state) => state.deliveryNote);
  const setDeliveryNote = useOrderStore((state) => state.setDeliveryNote);
  function handleAddNote() {
    if (deliveryNote.length) setDeliveryNote("");
    else router.push("/add-delivery-note-modal");
    // setAddNoteModalOpen(true);
  }

  return (
    <Card containerStyle={styles.cardContainer}>
      {/* delivery-time-row */}
      <View style={{ ...styles.deliveryCardRow, alignItems: "center" }}>
        <Octicons name="stopwatch" size={18} color={theme.colors.primary} />
        <View style={{ flexDirection: "row" }}>
          {
            deliveryDetailLoading ?
              <Skeleton
                animation="pulse"
                height={40}
                style={styles.skeletonStructure}
                skeletonStyle={styles.skeleton}
              /> :
              deliveryDetails?.deliveryAvailable ?

                <Text style={{ fontFamily: "jakarta-sans-regular", fontSize: 14 }}>
                  Delivery in{" "}
                  {boolAddressSelected
                    ? deliveryDetails?.deliveryTime + " " + "mins (approx.)" : "-- min"}
                </Text> :
                <Text style={{ fontFamily: "jakarta-sans-regular", fontSize: 14, color: theme.colors.error }}>
                  Delivery is unavailable for selected location
                </Text>
          }
        </View>
      </View>
      {/* delivery-address-row */}
      <View style={styles.deliveryCardRow}>
        <FontAwesome5
          name="location-arrow"
          size={15}
          color={theme.colors.primary}
          style={{ marginTop: 7 }}
        />
        <View>
          <Text style={{ fontFamily: "jakarta-sans-regular", fontSize: 14 }}>
            Delivery at{" "}
          </Text>
          <Text style={{ fontFamily: "jakarta-sans-semibold", fontSize: 12 }}>
            {boolHasSavedAddresses
              ? `${address.address_line_1}, ${address.address_line_2}, ${address.city}.`
              : ""}
          </Text>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button
              icon={
                <AntDesign
                  name={deliveryNote.length ? "close" : "plus"}
                  size={14}
                  color={theme.colors.primary}
                  style={{ marginRight: 1 }}
                />
              }
              title={
                deliveryNote.length ? "Remove" : "Add note for delivery partner"
              }
              type={"outline"}
              titleStyle={{ fontSize: 12, color: theme.colors.primary }}
              buttonStyle={{
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderWidth: 0.6,
              }}
              containerStyle={{ marginTop: 6, borderRadius: 8 }}
              onPress={handleAddNote}
            />
            <Button
              icon={
                !boolHasSavedAddresses && !boolAddressSelected ? (
                  <FontAwesome6
                    name="plus"
                    size={16}
                    color="#FDE4E8"
                    style={{ marginRight: 6 }}
                  />
                ) : (
                  <FontAwesome5
                    name="exchange-alt"
                    size={11}
                    color={theme.colors.primary}
                    style={{ marginRight: 4 }}
                  />
                )
              }
              title={
                boolHasSavedAddresses && boolAddressSelected
                  ? "Change Address"
                  : boolHasSavedAddresses
                    ? "Select Address"
                    : "Add Address"
              }
              type={"outline"}
              titleStyle={{ fontSize: 12, color: theme.colors.primary }}
              buttonStyle={{
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderWidth: 0.6,
              }}
              containerStyle={{ marginTop: 6, borderRadius: 8 }}
              onPress={handleChangeAddressButton}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          ...styles.deliveryCardRow,
          alignItems: "center",
          borderBottomWidth: 0,
        }}
      >
        <Feather
          name="phone-call"
          size={18}
          color={theme.colors.primary}
          style={{ marginTop: 4 }}
        />
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontFamily: "jakarta-sans-regular", fontSize: 14 }}>
            {user.firstName} {user.lastName},{" "}
          </Text>
          <Text style={{ fontFamily: "jakarta-sans-semibold", fontSize: 14 }}>
            +91 {user.contact}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default DeliveryInfoCard;
