import { View, StyleSheet } from 'react-native';
import { Text, Button, Icon } from '@rneui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import NotificationList from './components/NotificationList';
import { router } from 'expo-router';

const API_URL = 'http://192.168.15.8:3001';

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const { user, markNotificationAsRead } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`);
      const data = await response.json();
      // Filtrar notificações do usuário atual
      const userNotifications = data.filter(n => n.userId === user.id);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = async (notification) => {
    try {
      console.log('Tentando marcar notificação como lida:', notification);
      
      // Atualiza o estado local imediatamente para feedback visual
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );

      // Tenta marcar como lida no servidor
      await markNotificationAsRead(notification.id);
      
      // Recarrega as notificações para garantir sincronização
      await fetchNotifications();
      
      console.log('Notificação marcada como lida com sucesso');
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      // Reverte o estado local em caso de erro
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notification.id ? { ...n, read: false } : n
        )
      );
      // Recarrega as notificações mesmo em caso de erro
      await fetchNotifications();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text h4>Notificações</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Icon name="hourglass-empty" type="material" size={48} color="#BDBDBD" />
          <Text style={styles.loadingText}>Carregando notificações...</Text>
        </View>
      ) : (
        <NotificationList
          notifications={notifications}
          onNotificationPress={handleNotificationPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  badge: {
    backgroundColor: '#f44336',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
}); 