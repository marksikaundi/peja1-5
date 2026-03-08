import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#0F766E",
        tabBarInactiveTintColor: "#627D98",
        tabBarStyle: {
          position: "absolute",
          left: 12,
          right: 12,
          bottom: Platform.OS === "ios" ? 14 : 10,
          height: Platform.OS === "ios" ? 74 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 14 : 8,
          borderRadius: 20,
          borderTopWidth: 1,
          borderTopColor: "#CCE2DF",
          borderColor: "#CCE2DF",
          backgroundColor: "#FFFFFF",
          shadowColor: "#12343B",
          shadowOpacity: 0.08,
          shadowRadius: 14,
          shadowOffset: {
            width: 0,
            height: 8,
          },
          elevation: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
          marginTop: Platform.OS === "ios" ? 1 : 0,
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
        name="open"
        options={{
          title: "Open",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "folder-open" : "folder-open-outline"} size={size} color={color} />
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
