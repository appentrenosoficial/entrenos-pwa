import { AccountGate } from "../../src/auth/AccountGate";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { theme } from "@entrenos/ui";
const tabs: {
  name: string;
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
}[] = [
  { name: "index", title: "Início", icon: "home-outline" },
  { name: "explore", title: "Explorar", icon: "compass-outline" },
  { name: "create", title: "Criar", icon: "add-circle-outline" },
  { name: "chat", title: "Chat", icon: "chatbubbles-outline" },
  { name: "profile", title: "Perfil", icon: "person-outline" },
];
export default function TabLayout() {
  return (
    <AccountGate>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.muted,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
          tabBarLabelStyle: { fontSize: 11 },
        }}
      >
        {tabs.map(({ name, title, icon }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              tabBarIcon: ({ focused, size }) => (
                <Ionicons
                  name={icon}
                  size={size}
                  color={focused ? theme.colors.primary : theme.colors.muted}
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </AccountGate>
  );
}
