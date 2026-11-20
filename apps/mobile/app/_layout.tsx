import { StartupBoundary } from "../src/brand/StartupBoundary";
import { AuthProvider } from "../src/auth/AuthProvider";
import { AccountProvider } from "../src/features/account/AccountProvider";
import { DarkTheme, ThemeProvider, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { theme } from "@entrenos/ui";
export default function RootLayout() {
  return (
    <AuthProvider>
      <AccountProvider>
        <StartupBoundary>
          <ThemeProvider
            value={{
              ...DarkTheme,
              colors: {
                ...DarkTheme.colors,
                background: theme.colors.background,
                card: theme.colors.surface,
                text: theme.colors.text,
                primary: theme.colors.primary,
                border: theme.colors.border,
              },
            }}
          >
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: theme.colors.background },
                headerTintColor: theme.colors.text,
                contentStyle: { backgroundColor: theme.colors.background },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="auth/callback"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="[section]"
                options={{ title: "EntreNós", headerBackTitle: "Voltar" }}
              />
            </Stack>
          </ThemeProvider>
        </StartupBoundary>
      </AccountProvider>
    </AuthProvider>
  );
}
