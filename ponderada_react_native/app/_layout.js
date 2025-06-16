import { Stack } from 'expo-router';
import { ThemeProvider } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { Button, Icon } from '@rneui/themed';
import { router } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';

const API_URL = 'http://192.168.15.8:3001';

function HeaderRight() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`);
      const notifications = await response.json();
      const count = notifications.filter(n => n.userId === user.id && !n.read).length;
      setUnreadCount(count);
    } catch (error) {
      console.error('Erro ao buscar contagem de notificações:', error);
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ position: 'relative' }}>
        <Button
          icon={
            <Icon
              name="notifications"
              type="material"
              color="white"
              size={24}
            />
          }
          onPress={() => router.push('/notifications')}
          type="clear"
          containerStyle={{ marginRight: 10 }}
        />
        {unreadCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 5,
              backgroundColor: '#f44336',
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              {unreadCount}
            </Text>
          </View>
        )}
      </View>
      <Button
        icon={
          <Icon
            name="person"
            type="material"
            color="white"
            size={24}
          />
        }
        onPress={() => router.push('/profile')}
        type="clear"
      />
    </View>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2196F3',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: 'Login',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="register"
              options={{
                title: 'Cadastro',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="home"
              options={{
                title: 'Produtos',
                headerRight: () => <HeaderRight />,
              }}
            />
            <Stack.Screen
              name="product-details"
              options={{
                title: 'Detalhes do Produto',
              }}
            />
            <Stack.Screen
              name="profile"
              options={{
                title: 'Perfil',
              }}
            />
            <Stack.Screen
              name="notifications"
              options={{
                title: 'Notificações',
              }}
            />
          </Stack>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
} 