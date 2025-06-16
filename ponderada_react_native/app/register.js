import { View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { Text, Button, Input, Icon } from '@rneui/themed';
import { router } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from './context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

export default function Register() {
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao selecionar imagem');
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await signUp(name, email, password, profileImage);
      router.replace('/home');
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Icon name="person-add" type="ionicon" size={100} color="#2196F3" />
          )}
          <View style={styles.editIconContainer}>
            <Icon name="edit" type="material" color="white" size={20} />
          </View>
        </TouchableOpacity>
        <Text h3 style={styles.title}>Cadastro</Text>
      </View>
      <View style={styles.form}>
        <Input
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          leftIcon={<Icon name="person" type="material" color="#2196F3" />}
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          leftIcon={<Icon name="email" type="material" color="#2196F3" />}
          keyboardType="email-address"
        />
        <Input
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          leftIcon={<Icon name="lock" type="material" color="#2196F3" />}
          secureTextEntry
        />
        <Input
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          leftIcon={<Icon name="lock-outline" type="material" color="#2196F3" />}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title="Cadastrar"
          onPress={handleRegister}
          loading={loading}
          buttonStyle={styles.registerButton}
        />
        <Button
          title="Já tem uma conta? Entrar"
          type="clear"
          onPress={() => router.replace('/')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    borderRadius: 15,
    padding: 5,
  },
  title: {
    marginTop: 10,
    color: '#333',
  },
  form: {
    paddingHorizontal: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    marginBottom: 10,
  },
}); 