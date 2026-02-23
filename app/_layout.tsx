import { Stack } from "expo-router";
import { PapersProvider } from "@/src/context/PapersContext";

export default function RootLayout() {
  return (
    <PapersProvider>
      <Stack
        screenOptions={{
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
  );
}
