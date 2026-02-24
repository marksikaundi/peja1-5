import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PapersProvider } from "@/src/context/PapersContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PapersProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: "#FFFFFF",
            },
            headerShadowVisible: false,
            headerTintColor: "#12324A",
            contentStyle: {
              backgroundColor: "#F4F6F8",
            },
          }}
        />
      </PapersProvider>
    </SafeAreaProvider>
  );
}
