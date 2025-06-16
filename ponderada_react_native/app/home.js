import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Button, Text, ListItem, Icon } from '@rneui/themed';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from './context/AuthContext';

// Use your machine's IP address for physical device
const API_URL = 'http://192.168.15.8:3001'; // Substitua pelo seu IP local
const ITEMS_PER_PAGE = 10;

export default function Home() {
  const insets = useSafeAreaInsets();
  const { user, createNotification } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async (page = 1, shouldRefresh = false) => {
    try {
      if (shouldRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Primeiro, vamos buscar o total de produtos
      const countResponse = await fetch(`${API_URL}/products`);
      const allProducts = await countResponse.json();
      console.log('Resposta da API (todos os produtos):', allProducts);
      const total = allProducts.length;
      const lastPage = Math.ceil(total / ITEMS_PER_PAGE);

      // Calculamos o índice inicial para a página atual
      const start = (page - 1) * ITEMS_PER_PAGE;

      // Agora buscamos a página específica usando _start e _limit
      const response = await fetch(`${API_URL}/products?_start=${start}&_limit=${ITEMS_PER_PAGE}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Dados da página atual:', data);
      
      if (shouldRefresh) {
        setProducts(data);
      } else {
        setProducts(prevProducts => [...prevProducts, ...data]);
      }
      
      setHasMore(page < lastPage);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      console.error('Erro completo:', err);
      setError('Falha ao carregar produtos: ' + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, true);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(currentPage + 1);
    }
  };

  const handleRefresh = () => {
    fetchProducts(1, true);
  };

  const handleProfilePress = () => {
    router.replace('profile');
  };

  const handleProductPress = (product) => {
    router.push(`/product-details?id=${product.id}`);
  };

  const renderProduct = ({ item }) => (
    <ListItem
      onPress={() => handleProductPress(item)}
      bottomDivider
      containerStyle={styles.productItem}
    >
      <Icon name="shopping-bag" type="material" color="#2196F3" />
      <ListItem.Content>
        <ListItem.Title style={styles.productName}>{item.name}</ListItem.Title>
        <ListItem.Subtitle style={styles.productDescription}>
          {item.description}
        </ListItem.Subtitle>
        <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
        <Text style={styles.productCategory}>Categoria: {item.category}</Text>
        <Text style={styles.productStock}>Em estoque: {item.stock}</Text>
      </ListItem.Content>
      <Icon name="chevron-right" type="material" color="#2196F3" />
    </ListItem>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Tentar Novamente"
          onPress={() => fetchProducts(1, true)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.productList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="shopping-bag" type="material" size={48} color="#BDBDBD" />
            <Text style={styles.emptyText}>Nenhum produto disponível</Text>
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
  productList: {
    paddingBottom: 20,
  },
  productItem: {
    backgroundColor: 'white',
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
    marginTop: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  productStock: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
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