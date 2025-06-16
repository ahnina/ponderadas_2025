import { View, StyleSheet, FlatList } from 'react-native';
import { Text, ListItem, Icon, Badge } from '@rneui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationList({ notifications, onNotificationPress }) {
  const insets = useSafeAreaInsets();

  // Ordenar notificações por data (mais recentes primeiro)
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  const handleNotificationPress = async (item) => {
    try {
      await onNotificationPress(item);
    } catch (error) {
      console.error('Erro ao processar clique na notificação:', error);
    }
  };

  const renderNotification = ({ item }) => {
    const getIconName = (type) => {
      switch (type) {
        case 'order':
          return 'shopping-cart';
        case 'system':
          return 'info';
        case 'promo':
          return 'local-offer';
        case 'product':
          return 'shopping-bag';
        default:
          return 'notifications';
      }
    };

    const getIconColor = (type) => {
      switch (type) {
        case 'order':
          return '#2196F3';
        case 'system':
          return '#FFA000';
        case 'promo':
          return '#4CAF50';
        case 'product':
          return '#9C27B0';
        default:
          return '#757575';
      }
    };

    return (
      <ListItem
        onPress={() => handleNotificationPress(item)}
        bottomDivider
        containerStyle={[
          styles.notificationItem,
          !item.read && styles.unreadNotification
        ]}
      >
        <View style={styles.iconContainer}>
          <Icon
            name={getIconName(item.type)}
            type="material"
            color={getIconColor(item.type)}
            size={24}
          />
        </View>
        <ListItem.Content style={styles.contentContainer}>
          <ListItem.Title style={styles.title}>{item.title}</ListItem.Title>
          <ListItem.Subtitle style={styles.message}>{item.message}</ListItem.Subtitle>
          <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
        </ListItem.Content>
        {!item.read && (
          <Badge
            value=""
            status="error"
            containerStyle={styles.badge}
          />
        )}
      </ListItem>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={sortedNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="notifications-off"
              type="material"
              size={48}
              color="#BDBDBD"
            />
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    flexGrow: 1,
    padding: 10,
  },
  notificationItem: {
    backgroundColor: 'white',
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 10,
  },
  unreadNotification: {
    backgroundColor: '#E3F2FD',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#212121',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
}); 