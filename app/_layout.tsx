import { Stack, router } from "expo-router";
import { useState } from "react";
import { Platform } from "react-native";
import { Button, lightColors, createTheme, ThemeProvider } from "@rneui/themed";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { getValueFor, updateToken } from "@/utils";
import useUserStore from "../store/userStore";
import { api } from "@/constants/api";
// To fix bug of navigating before the navigator is ready.
import { useRootNavigationState, Redirect } from "expo-router";

SplashScreen.preventAutoHideAsync();

const theme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
    primary: "#EF5350",
    secondary: "#FDE4E8",
    background: "#FFFDFE",
  },
  components: {
    Button: {
      titleStyle: { color: "#FFCDD2", fontSize: 14 },
      buttonStyle: {
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
      },
    },
  },
});

async function handleTokenExpiration(
  responseData: any,
  token: string,
  endpoint: string
) {
  if (responseData.tokenErr && responseData.tokenErr === "expired") {
    try {
      console.log('refreshing')
      const refreshToken = await getValueFor("refreshToken");
      const responseForRefreshToken = await fetch(`${api}/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
      const refreshTokenRes = await responseForRefreshToken.json();
      updateToken(refreshTokenRes.newToken);
      const retryPrevRequest = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${refreshTokenRes.newToken}`,
        },
      });
      const prevRequestData = await retryPrevRequest.json();
      return prevRequestData;
    } catch (e) {
      console.log("refres wala error")
      console.log(e);
    }
  } else {
    return null;
  }
}
export default function RootLayout() {
  const [loaded, fontError] = useFonts({
    "jakarta-sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "jakarta-sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "jakarta-sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "jakarta-sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "jakarta-sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
  });
  
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const [loadingUser, setLoadingUser] = useState(true);

  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if ((loaded || fontError) && !loadingUser) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loadingUser, fontError]);
  
  // alert(fontError)
  // alert(loaded)
  // alert(loadingUser)

  useEffect(() => {
    (async () => {
      const token = await getValueFor("token");
      if (token) {
        try {
          const response = await fetch(`${api}/user`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              'x-platform': Platform.OS
            },
          });
          const responseData = await response.json();
          console.log(responseData)
          const retriedRequestData = await handleTokenExpiration(
            responseData,
            token,
            `${api}/user`
          );
          if (retriedRequestData) {
            //if token was expired and made a re-request after refreshing the token.
            const userData = retriedRequestData.data[0];
            console.log(userData)
            setUser({...userData, token});
            console.log("yeeee haiiii user", user);
            setLoadingUser(false);
          } else {
            //if token was not expired.
            const userData = responseData.data[0]
            setUser({...userData, token});
            console.log(userData)
            setLoadingUser(false);
          }
        } catch (e) {
          console.log(e);
        }
        if(rootNavigationState?.key)
          router.replace("/");
      } else {
        if(rootNavigationState?.key)
          router.replace("/login");
      }
    })();
  }, []);
  if (!loaded) {
    return null;
  }


  return (
    <ThemeProvider theme={theme}>
      <Stack> 
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="offers" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}