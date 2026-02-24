import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#0D68A8",
        tabBarInactiveTintColor: "#7991A7",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 82 : 68,
          paddingTop: Platform.OS === "ios" ? 10 : 8,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          borderTopWidth: 1,
          borderTopColor: "#D7E1EB",
          backgroundColor: "#FFFFFF",
        },
        tabBarItemStyle: {
          paddingVertical: Platform.OS === "ios" ? 2 : 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: Platform.OS === "ios" ? 2 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "information-circle" : "information-circle-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
