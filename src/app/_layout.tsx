import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import ThemeToggleButton from "@/components/themeToggle";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <ThemeProvider>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        {/* 3. Gunakan Stack.Screen untuk mengatur opsi tampilan header halaman */}
        <Stack.Screen name="index" />
        <Stack.Screen name="login_screen" />
        <Stack.Screen name="dashboard" />
      </Stack>

      <ThemeToggleButton />
    </ThemeProvider>
  );
}
