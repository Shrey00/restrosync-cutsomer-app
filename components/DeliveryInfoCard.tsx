import React, { useEffect, useState } from "react";
import {
  Platform,
  View,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { Card } from "@rneui/themed";
import Header from "@/components/Header";
import { Text, Button } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { api } from "@/constants/api";

const DeliveryInfoCard = () => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    cardContainer: {
      // borderWidth: 1,
      // borderColor: "#EF9A9A",
      padding: 12,
      marginHorizontal: 10,
      // marginTop: 20,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.008,
      shadowRadius: 4,
      elevation: 1, // For Android
    },
    deliveryCardRow: {
      flexDirection: "row",
      //   alignItems: "center",
      gap: 6,
      paddingBottom: 6,
      borderBottomWidth: 1,
      paddingVertical:4,
      borderColor: theme.colors.grey5,
    },
  });

  return (
    <Card containerStyle={styles.cardContainer}>
      {/* delivery-time-row */}
      <View style={{ ...styles.deliveryCardRow, alignItems: "center" }}>
        <Octicons name="stopwatch" size={18} color={theme.colors.primary} />
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontFamily: "jakarta-sans-regular", fontSize: 14 }}>
            Delivery in{" "}
          </Text>
          <Text style={{ fontFamily: "jakarta-sans-semibold", fontSize: 14 }}>
            40min
          </Text>
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
            355, Sector 12, Kotra Bhatha, Atal Nagar, Raipur
          </Text>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button
              icon={
                <AntDesign
                  name="plus"
                  size={14}
                  color={theme.colors.primary}
                  style={{ marginRight: 1 }}
                />
              }
              title={"Add note for delivery partner"}
              type={"outline"}
              titleStyle={{ fontSize: 12, color: theme.colors.primary }}
              buttonStyle={{
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderWidth: 0.6,
              }}
              containerStyle={{ marginTop: 6 }}
            />
            <Button
              icon={
                <FontAwesome5
                  name="exchange-alt"
                  size={11}
                  color={theme.colors.primary}
                  style={{ marginRight: 4 }}
                />
              }
              title={"Change Address"}
              type={"outline"}
              titleStyle={{ fontSize: 12, color: theme.colors.primary }}
              buttonStyle={{
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderWidth: 0.6,
              }}
              containerStyle={{ marginTop: 6 }}
            />
          </View>
        </View>
      </View>
      <View style={{ ...styles.deliveryCardRow, alignItems: "center", borderBottomWidth:0 }}>
        <Feather name="phone-call" size={18} color={theme.colors.primary} style={{marginTop:4}} />
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontFamily: "jakarta-sans-regular", fontSize: 14 }}>
            Pankaj Sharma, {" "}
          </Text>
          <Text style={{ fontFamily: "jakarta-sans-semibold", fontSize: 14 }}>
            +91 9174524055
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default DeliveryInfoCard;