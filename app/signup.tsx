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
import { Link } from "expo-router";
import { validatePathConfig } from "@react-navigation/native";
const LoginScreen = () => {
  const { theme } = useTheme();
  const [useOtp, setUseOtp] = useState(true);
  const [sentOtp, setSentOtp] = useState(false);
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [warningText, setWarningText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [signupFormStep, setSignupFormStep] = useState(1);
  const setUser = useUserStore((state) => state.setUser);
  const matchPasswords = () => {
    return formData.password === confirmPassword;
  };
  const handleSignup = async () => {
    try {
      setIsOtpLoading(true);
      const response = await fetch(`${api}/send-otp-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formData.phone }),
      });
      const data = await response.json();
      setIsOtpLoading(false);
    } catch (e) {
      console.log(e);
      setIsOtpLoading(false);
    }
  };
  const handleValidateForm = async () => {
    const passwordValidation = matchPasswords();
    if (passwordValidation) {
      await handleSignup();
      setSignupFormStep(3);
    }
  };
  const handleOTPSignup = async () => {
    try {
      setVerifyOtpLoading(true);
      const response = await fetch(`${api}/verify-otp-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
    } catch (e) {
      console.log(e);
      setVerifyOtpLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      {signupFormStep === 1 && (
        <View>
          <CustomInput
            placeholder="First Name"
            value={formData.firstName}
            style={{ paddingVertical: 8 }}
            onChangeText={(text) =>
              setFormData({ ...formData, firstName: text })
            }
          />
          <CustomInput
            placeholder="Last Name"
            value={formData.lastName}
            style={{ paddingVertical: 8 }}
            onChangeText={(text) =>
              setFormData({ ...formData, lastName: text })
            }
          />
          <CustomInput
            placeholder="Email"
            value={formData.email}
            style={{ paddingVertical: 8 }}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          <Button
            title="Next"
            iconRight={true}
            icon={
              <Entypo
                name="chevron-right"
                size={28}
                style={{ marginTop: 3 }}
                color={theme.colors.secondary}
              />
            }
            loading={isLoading}
            onPress={() => {
              if (
                formData.firstName.length &&
                formData.lastName.length &&
                formData.email.length
              ) {
                setSignupFormStep(2);
              }
            }}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            loadingStyle={{ height: 25.5 }}
          />
        </View>
      )}
      {signupFormStep === 2 && (
        <View>
          <CustomInput
            placeholder="Phone no."
            value={formData.phone}
            style={{ paddingVertical: 8 }}
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />
          <CustomInput
            placeholder="Password"
            value={formData.password}
            secureTextEntry={true}
            style={{ paddingVertical: 8 }}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
          />
          <CustomInput
            placeholder="Confirm Password"
            value={confirmPassword}
            secureTextEntry={true}
            style={{ paddingVertical: 8 }}
            onChangeText={setConfirmPassword}
          />
          <Button
            title="Next"
            iconRight={true}
            icon={
              <Entypo
                name="chevron-right"
                size={28}
                style={{ marginTop: 3 }}
                color={theme.colors.secondary}
              />
            }
            loading={isOtpLoading}
            onPress={() => {
              if (
                formData.phone.length &&
                formData.password.length &&
                confirmPassword.length
              ) {
                handleValidateForm();
              }
            }}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            loadingStyle={{ height: 25.5 }}
          />
          <Pressable
            onPress={() => {
              setSignupFormStep(1);
            }}
          >
            <Text style={{ ...styles.switchText, textAlign: "center" }}>
              {/* <Entypo
                  name="chevron-thin-left"
                  size={20}
                  style={{
                    color: "#2089dc",
                    fontFamily: "jakarta-sans-regular",
                    fontSize: 14,
                  }}
                  color={theme.colors.secondary}
                /> */}
              Back
            </Text>
          </Pressable>
        </View>
      )}
      {signupFormStep === 3 && (
        <View>
          <CustomInput
            placeholder="Enter 6 digit OTP"
            value={formData.otp}
            keyboardType="number-pad"
            style={{ paddingVertical: 8 }}
            onChangeText={(text) => setFormData({ ...formData, otp: text })}
            maxLength={6}
          />
          <Button
            title="Sign Up"
            loading={verifyOtpLoading}
            onPress={handleOTPSignup}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            loadingStyle={{ height: 25.5 }}
          />
          <Pressable
            onPress={() => {
              setSignupFormStep(2);
              setUseOtp(true);
            }}
          >
            <Text style={{ ...styles.switchText, textAlign: "center" }}>
              Back
            </Text>
          </Pressable>
        </View>
      )}
      {!!warningText.length && (
        <Text style={{ color: theme.colors.error, textAlign: "center" }}>
          {warningText}
        </Text>
      )}
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
        <Text style={styles.welcomeText}>Welcome To</Text>
        <Text style={styles.backText}>Eatsinn!</Text>
      </View>
      <Text style={styles.infoText}>
        Signup at Eatsinn, and get your favourite food right at your door steps!
      </Text>
      <LoginScreen />
      <Text
        style={{
          color: theme.colors.grey2,
          textAlign: "center",
          marginTop: 25,
        }}
      >
        Already have an account?
      </Text>
      <Link href="/login" style={{ textAlign: "center" }}>
        <Text style={{ ...styles.switchText }}>Login</Text>
      </Link>
    </SafeAreaView>
  );
}
