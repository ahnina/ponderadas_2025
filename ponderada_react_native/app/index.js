import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Input, Icon } from '@rneui/themed';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from './context/AuthContext';

export default function Login() {
  const insets = useSafeAreaInsets();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (email) {
        try {
          const response = await fetch(`http://192.168.15.8:3001/users?email=${encodeURIComponent(email)}`);
          const users = await response.json();
          if (users.length > 0 && users[0].profileImage) {
            setProfileImage(users[0].profileImage);
          } else {
            setProfileImage(null);
          }
        } catch {
          setProfileImage(null);
        }
      } else {
        setProfileImage(null);
      }
    };
    fetchProfileImage();
  }, [email]);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    try {
      await signIn(email, password);
      router.replace('/home');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
    }
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={styles.content}>
        <View style={styles.header}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Icon name="person" type="ionicon" size={100} color="#2196F3" />
          )}
        </View>
        <Text h3 style={styles.title}>Entrar</Text>
        <View style={styles.form}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Icon name="email" type="material" color="#2196F3" />}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            leftIcon={<Icon name="lock" type="material" color="#2196F3" />}
            rightIcon={
              <Icon
                name={showPassword ? 'visibility' : 'visibility-off'}
                type="material"
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            secureTextEntry={!showPassword}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            buttonStyle={styles.loginButton}
          />
          <Button
            title="Não tem uma conta? Cadastre-se"
            type="clear"
            onPress={() => router.replace('/register')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  form: {
    width: '100%',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    marginBottom: 10,
  },
}); 