import { View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { Text, Button, ListItem, Icon, Input } from '@rneui/themed';
import { useAuth } from './context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  const { user, signOut, updateUser } = useAuth();
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [editedPassword, setEditedPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(user?.profileImage);
  const [loading, setLoading] = useState(false);

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

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validações
      if (!editedName || !editedEmail) {
        Alert.alert('Erro', 'Nome e email são obrigatórios');
        return;
      }

      if (editedPassword && editedPassword !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem');
        return;
      }

      if (editedPassword && editedPassword.length < 6) {
        Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
        return;
      }

      // Preparar dados para atualização
      const updates = {
        name: editedName,
        email: editedEmail,
        profileImage: profileImage,
      };

      if (editedPassword) {
        updates.password = editedPassword;
      }

      // Atualizar usuário
      await updateUser(user.id, updates);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer logout');
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={isEditing ? handlePickImage : undefined}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Icon name="person" type="ionicon" size={100} color="#2196F3" />
          )}
          {isEditing && (
            <View style={styles.editIconContainer}>
              <Icon name="edit" type="material" color="white" size={20} />
            </View>
          )}
        </TouchableOpacity>
        <Text h4 style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.content}>
        {isEditing ? (
          <>
            <Input
              placeholder="Nome"
              value={editedName}
              onChangeText={setEditedName}
              leftIcon={<Icon name="person" type="material" color="#2196F3" />}
            />
            <Input
              placeholder="Email"
              value={editedEmail}
              onChangeText={setEditedEmail}
              leftIcon={<Icon name="email" type="material" color="#2196F3" />}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              placeholder="Nova senha (opcional)"
              value={editedPassword}
              onChangeText={setEditedPassword}
              leftIcon={<Icon name="lock" type="material" color="#2196F3" />}
              secureTextEntry
            />
            <Input
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              leftIcon={<Icon name="lock-outline" type="material" color="#2196F3" />}
              secureTextEntry
            />
            <Button
              title="Salvar"
              onPress={handleSave}
              loading={loading}
              buttonStyle={styles.saveButton}
            />
            <Button
              title="Cancelar"
              type="clear"
              onPress={() => {
                setIsEditing(false);
                setEditedName(user.name);
                setEditedEmail(user.email);
                setEditedPassword('');
                setConfirmPassword('');
                setProfileImage(user.profileImage);
              }}
            />
          </>
        ) : (
          <>
            <ListItem>
              <Icon name="person" type="material" color="#2196F3" />
              <ListItem.Content>
                <ListItem.Title>Nome</ListItem.Title>
                <ListItem.Subtitle>{user.name}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            <ListItem>
              <Icon name="email" type="material" color="#2196F3" />
              <ListItem.Content>
                <ListItem.Title>Email</ListItem.Title>
                <ListItem.Subtitle>{user.email}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            <Button
              title="Editar Perfil"
              onPress={() => setIsEditing(true)}
              buttonStyle={styles.editButton}
            />
            <Button
              title="Sair"
              onPress={handleSignOut}
              buttonStyle={styles.signOutButton}
            />
          </>
        )}
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
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  name: {
    marginTop: 10,
    color: '#333',
  },
  email: {
    color: '#666',
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  editButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    marginTop: 10,
  },
}); 