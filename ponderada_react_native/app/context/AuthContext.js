import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.15.8:3001';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      const storedUser = await AsyncStorage.getItem('@AuthData:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    try {
      const response = await fetch(`${API_URL}/users`);
      const users = await response.json();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        throw new Error('Email ou senha inválidos');
      }

      const userData = { ...user };
      delete userData.password;
      setUser(userData);
      await AsyncStorage.setItem('@AuthData:user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async function signUp(name, email, password, profileImage) {
    try {
      const response = await fetch(`${API_URL}/users`);
      const users = await response.json();

      if (users.some(u => u.email === email)) {
        throw new Error('Email já cadastrado');
      }

      const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        profileImage,
      };

      const createResponse = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!createResponse.ok) {
        throw new Error('Erro ao criar usuário');
      }

      const userData = { ...newUser };
      delete userData.password;
      setUser(userData);
      await AsyncStorage.setItem('@AuthData:user', JSON.stringify(userData));

      // Criar notificação de boas-vindas
      await createNotification({
        userId: newUser.id,
        type: 'system',
        title: 'Bem-vindo!',
        message: 'Seu cadastro foi realizado com sucesso.',
        read: false,
        timestamp: new Date().toISOString(),
      });

      return userData;
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem('@AuthData:user');
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  async function updateUser(userId, updates) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      const currentUser = await response.json();

      const updatedUser = {
        ...currentUser,
        ...updates,
      };

      const updateResponse = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!updateResponse.ok) {
        throw new Error('Erro ao atualizar usuário');
      }

      const userData = { ...updatedUser };
      delete userData.password;
      setUser(userData);
      await AsyncStorage.setItem('@AuthData:user', JSON.stringify(userData));

      // Criar notificação de atualização
      await createNotification({
        userId: userId,
        type: 'system',
        title: 'Perfil Atualizado',
        message: 'Suas informações foram atualizadas com sucesso.',
        read: false,
        timestamp: new Date().toISOString(),
      });

      return userData;
    } catch (error) {
      throw error;
    }
  }

  async function createNotification(notification) {
    try {
      // Primeiro, buscar todas as notificações para garantir que o ID seja único
      const response = await fetch(`${API_URL}/notifications`);
      const notifications = await response.json();
      
      // Criar a nova notificação com um ID único
      const newNotification = {
        ...notification,
        id: notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1,
      };

      // Enviar a notificação para o servidor
      const createResponse = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNotification),
      });

      if (!createResponse.ok) {
        throw new Error('Erro ao criar notificação');
      }

      const createdNotification = await createResponse.json();
      return createdNotification;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  }

  const markNotificationAsRead = async (notificationId) => {
    try {
      console.log('Iniciando atualização da notificação:', notificationId);
      
      const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedNotification = await response.json();
      console.log('Notificação atualizada com sucesso:', updatedNotification);

      // Atualiza a lista local de notificações
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      return updatedNotification;
    } catch (error) {
      console.error('Erro detalhado ao marcar notificação como lida:', error);
      throw new Error('Erro ao marcar notificação como lida');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser,
        createNotification,
        markNotificationAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 