import { Text, View } from "react-native";
import Header from "@/components/Header";
import SearchBar from "@/components/Search";
import { ScrollView, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@rneui/themed";
import SlideLinkCardSection from "@/components/SlideLinkCardSection";
import CustomInput from "@/components/ui/CustomInput";
import React, { useState } from "react";
import { Input, Button } from "@rneui/themed";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import useUserStore from "../store/userStore";
import { save, updateToken } from "@/utils";
import { router } from "expo-router";
import {api} from '../constants/api';
const LoginScreen = () => {
  const { theme } = useTheme();
  const [useOtp, setUseOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const handleLogin = async () => {
    if (useOtp) {
      console.log("Logging in with OTP:", otp);
    } else {
      // Phone/Email
      setIsLoading(true);
      try {
        const response = await fetch(`${api}/signin`, {
          method: "POST",
          headers: {
            // Accept: 'application/json',
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ email, password }).toString(),
        });
        const responseData = await response.json();
        const userData = responseData.data[0];
        console.log("WOW",userData)
        save("token", userData.token);
        save("refreshToken", userData.refreshToken);
        setUser(userData);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <View style={styles.container}>
      {!useOtp ? (
        <>
          <CustomInput
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            leftIcon={
              <AntDesign name="user" size={24} color={theme.colors.primary} />
            }
          />
          <CustomInput
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            leftIcon={
              <MaterialIcons
                name="password"
                size={24}
                color={theme.colors.primary}
              />
            }
          />
          <Button
            title="Login"
            onPress={handleLogin}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />
        </>
      ) : (
        <>
          <Text style={styles.otpText}>Enter OTP</Text>
          <CustomInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            leftIcon={
              <MaterialIcons
                name="password"
                size={24}
                color={theme.colors.primary}
              />
            }
          />
          <Button
            title="Verify OTP"
            onPress={handleLogin}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />
        </>
      )}

      <Button
        title={useOtp ? "Use Phone/Email" : "Use OTP Instead"}
        type="clear"
        onPress={() => setUseOtp(!useOtp)}
        titleStyle={styles.switchText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  button: {
    marginVertical: 16,
    paddingVertical: 14,
  },
  otpText: {
    fontSize: 16,
    fontFamily: "jakarta-sans-semibold",
    marginBottom: 10,
    textAlign: "center",
  },
  switchText: {
    color: "#2089dc",
    fontFamily: "jakarta-sans-semibold",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "jakarta-sans-semibold",
  },
});

export default function login() {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    welcomeContainer: {
      padding: 20,
      marginTop: 48,
    },
    welcomeText: {
      fontSize: 48,
      fontFamily: "jakarta-sans-bold",
      color: theme.colors.primary,
      lineHeight: 48,
    },
    backText: {
      fontSize: 48,
      lineHeight: 52,
      fontFamily: "jakarta-sans-bold",
    },
    infoText: {
      fontSize: 14,
      color: theme.colors.grey3,
      fontFamily: "jakarta-sans-regular",
      paddingHorizontal: 20,
    },
  });
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <Pressable onPress={()=>{router.replace("/")}}>
        <MaterialIcons name="chevron-left" size={24} color={theme.colors.primary} />
      </Pressable>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.backText}>back!</Text>
      </View>
      <Text style={styles.infoText}>
        Enter your info to login, and get your favourite food right at your door
        steps!
      </Text>
      <LoginScreen />
    </SafeAreaView>
  );
}
