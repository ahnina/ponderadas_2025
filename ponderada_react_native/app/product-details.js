import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Icon } from '@rneui/themed';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';

const API_URL = 'http://192.168.15.8:3001';

export default function ProductDetails() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, createNotification } = useAuth();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProduct(data);
      setError(null);

      // Criar notificação quando o produto for carregado
      if (user) {
        try {
          await createNotification({
            userId: user.id,
            type: 'product',
            title: 'Produto Visualizado',
            message: `Você visualizou o produto: ${data.name}`,
            read: false,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Erro ao criar notificação:', error);
        }
      }
    } catch (err) {
      setError('Falha ao carregar detalhes do produto: ' + err.message);
      console.error('Erro ao carregar detalhes do produto:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Icon name="hourglass-empty" size={50} color="#2196F3" />
          <Text style={styles.loadingText}>Carregando detalhes do produto...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Icon name="error" size={50} color="red" />
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Tentar Novamente"
            onPress={fetchProductDetails}
            containerStyle={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          
          <View style={styles.contentContainer}>
            <Text style={styles.productName}>{product.name}</Text>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
              <View style={[
                styles.stockBadge,
                { backgroundColor: product.stock > 0 ? '#4CAF50' : '#f44336' }
              ]}>
                <Text style={styles.stockText}>
                  {product.stock > 0 ? 'Em Estoque' : 'Sem Estoque'}
                </Text>
              </View>
            </View>

            <View style={styles.categoryContainer}>
              <Icon name="category" size={20} color="#666" />
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{product.description}</Text>

            <View style={styles.divider} />

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Icon name="inventory" size={20} color="#666" />
                <Text style={styles.detailText}>Estoque: {product.stock} unidades</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Icon name="star" size={20} color="#666" />
                <Text style={styles.detailText}>Avaliação: {product.rating}/5</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productImage: {
    width: '100%',
    height: 300,
  },
  contentContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stockText: {
    color: 'white',
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  detailsContainer: {
    marginTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 16,
  },
}); 