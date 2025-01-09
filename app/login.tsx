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
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import useUserStore from "../store/userStore";
import { save, updateToken } from "@/utils";
import { router } from "expo-router";
import { api } from "../constants/api";
import { validatePathConfig } from "@react-navigation/native";
import { Link } from "expo-router";
const LoginScreen = () => {
  const { theme } = useTheme();
  const [useOtp, setUseOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [sentOtp, setSentOtp] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [warningText, setWarningText] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const handleLogin = async () => {
    if (useOtp) {
      try {
        setIsOtpLoading(true);
        const response = await fetch(`${api}/send-otp-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        });
        const data = await response.json();
        if (data.statusCode === 401) {
          setWarningText("Account not found");
        } else {
          setSentOtp(true);
        }
        setIsOtpLoading(false);
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsLoading(true);
      try {
        const response = await fetch(`${api}/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ email, password }).toString(),
        });
        const responseData = await response.json();
        if (response.status === 200) {
          const userData = responseData.data[0];
          await save("token", userData.token);
          await save("refreshToken", userData.refreshToken);
          setUser(userData);
          setIsLoading(false);
          setWarningText("");
          router.push("/(tabs)");
        } else {
          setWarningText(responseData.desc);
          setIsLoading(false);
        }
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
  };

  const handleOTPLogin = async () => {
    setVerifyOtpLoading(true);
    const response = await fetch(`${api}/verify-otp-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await response.json();
    setVerifyOtpLoading(false);
    if (!data.statusCode) {
      setWarningText("");
      const userData = data[0];
      await save("token", userData.token);
      await save("refreshToken", userData.refreshToken);
      setUser(userData);
      setIsLoading(false);
      setWarningText("");
      router.push("/(tabs)");
    }
    if (data.statusCode === 400) {
      setOtp("");
      setPhone("");
      setSentOtp(false);
      setWarningText("OTP didn't match");
    }
  };
  return (
    <View style={styles.container}>
      {!useOtp ? (
        <>
          <CustomInput
            placeholder="Enter Email"
            value={email}
            style={{ paddingVertical: 8 }}
            onChangeText={setEmail}
          />
          <CustomInput
            placeholder="Enter Password"
            value={password}
            style={{ paddingVertical: 8 }}
            secureTextEntry={true}
            onChangeText={setPassword}
            textContentType="password"
          />
          {!!warningText.length && (
            <Text style={{ color: theme.colors.error, textAlign: "center" }}>
              {warningText}
            </Text>
          )}
          <Button
            title="Login"
            loading={isLoading}
            onPress={handleLogin}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            loadingStyle={{ height: 25.5 }}
          />
        </>
      ) : (
        <>
          {!sentOtp ? (
            <View>
              <Text style={styles.otpText}>Login with OTP</Text>
              <CustomInput
                placeholder="Phone no."
                value={phone}
                onChangeText={setPhone}
                style={{ paddingVertical: 8 }}
                keyboardType="number-pad"
                maxLength={10}
              />
              {!!warningText.length && (
                <Text
                  style={{ color: theme.colors.error, textAlign: "center" }}
                >
                  {warningText}
                </Text>
              )}
              <Button
                title="Send OTP"
                onPress={handleLogin}
                loading={isOtpLoading}
                buttonStyle={styles.button}
                titleStyle={styles.buttonText}
                loadingStyle={{ height: 25.5 }}
              />
            </View>
          ) : (
            <View>
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
                loading={verifyOtpLoading}
                onPress={handleOTPLogin}
                buttonStyle={styles.button}
                titleStyle={styles.buttonText}
                loadingStyle={{ height: 25.5 }}
              />
            </View>
          )}
        </>
      )}
      <Button
        title={useOtp ? "Use Phone/Email" : "Use OTP Instead"}
        type="clear"
        onPress={() => setUseOtp(!useOtp)}
        titleStyle={styles.switchText}
        containerStyle={{ borderRadius: 4 }}
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
    paddingVertical: 10,
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
    switchText: {
      color: "#2089dc",
      fontFamily: "jakarta-sans-semibold",
    },
  });
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
          router.replace("/");
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
          Home
        </Text>
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
      <Text
        style={{
          color: theme.colors.grey2,
          textAlign: "center",
          marginTop: 25,
        }}
      >
        Don't have an account?
      </Text>
      <Link href="/signup" style={{ textAlign: "center" }}>
        <Text style={{ ...styles.switchText }}>Signup</Text>
      </Link>
    </SafeAreaView>
  );
}
