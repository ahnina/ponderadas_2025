import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#1a1a1a',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Balatro Clone',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="shop"
          options={{
            title: 'Shop',
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
} 