import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { ModifierCard } from '../components/ModifierCard';
import { apiService } from '../services/api';
import { ModifierService } from '../services/modifierService';
import { GameStateService } from '../services/gameStateService';
import { Joker, Planet, Tarot } from '../types/game';

export default function ShopScreen() {
  const [jokers, setJokers] = useState<Joker[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [tarot, setTarot] = useState<Tarot[]>([]);
  const [loading, setLoading] = useState(true);
  const [money, setMoney] = useState(GameStateService.getMoney());
  const [selectedTab, setSelectedTab] = useState<'jokers' | 'planets' | 'tarot'>('jokers');
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadShopItems();
    
    // Escutar mudanças no dinheiro
    const unsubscribe = GameStateService.addListener((newMoney) => {
      setMoney(newMoney);
    });
    
    return unsubscribe;
  }, []);

  const loadShopItems = async () => {
    try {
      setLoading(true);
      const [jokersData, planetsData, tarotData] = await Promise.all([
        apiService.getAvailableJokers(),
        apiService.getAvailablePlanets(),
        apiService.getAvailableTarot()
      ]);
      
      console.log('Loaded items:', {
        jokers: jokersData.length,
        planets: planetsData.length,
        tarot: tarotData.length
      });
      
      setJokers(jokersData);
      setPlanets(planetsData);
      setTarot(tarotData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load shop items');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = useCallback(async (modifierId: string, type: 'jokers' | 'planets' | 'tarot') => {
    console.log('Attempting to purchase:', { modifierId, type });
    
    // Converter tipo plural para singular
    const normalizedType = type === 'jokers' ? 'joker' : 
                          type === 'planets' ? 'planet' : 
                          type === 'tarot' ? 'tarot' : type;
    
    console.log('Type check:', { 
      originalType: type,
      normalizedType,
      isJoker: normalizedType === 'joker', 
      isPlanet: normalizedType === 'planet', 
      isTarot: normalizedType === 'tarot' 
    });
    
    // Usar o estado atual das listas
    const currentJokers = jokers;
    const currentPlanets = planets;
    const currentTarot = tarot;
    
    console.log('Current lists:', {
      jokersCount: currentJokers.length,
      planetsCount: currentPlanets.length,
      tarotCount: currentTarot.length
    });
    
    // Log dos IDs disponíveis
    console.log('Available IDs:', {
      jokers: currentJokers.map(j => j.id),
      planets: currentPlanets.map(p => p.id),
      tarot: currentTarot.map(t => t.id)
    });
    
    // Buscar o modificador na lista correta
    let modifier: Joker | Planet | Tarot | undefined;
    
    if (normalizedType === 'joker') {
      modifier = currentJokers.find(j => j.id === modifierId);
    } else if (normalizedType === 'planet') {
      modifier = currentPlanets.find(p => p.id === modifierId);
    } else if (normalizedType === 'tarot') {
      modifier = currentTarot.find(t => t.id === modifierId);
    }

    console.log('Found modifier:', !!modifier, 'Type searched:', normalizedType);

    if (!modifier) {
      console.log('Modifier not found. Searching in:', normalizedType);
      console.log('Looking for ID:', modifierId);
      
      // Verificar se o ID existe em alguma lista
      const foundInJokers = currentJokers.find(j => j.id === modifierId);
      const foundInPlanets = currentPlanets.find(p => p.id === modifierId);
      const foundInTarot = currentTarot.find(t => t.id === modifierId);
      
      console.log('Search results:', {
        foundInJokers: !!foundInJokers,
        foundInPlanets: !!foundInPlanets,
        foundInTarot: !!foundInTarot
      });
      
      return;
    }

    const cost = 'cost' in modifier ? modifier.cost : (normalizedType === 'planet' ? 3 : 2);
    console.log('Purchase details:', { name: modifier.name, cost, currentMoney: money });
    
    if (money < cost) {
      Alert.alert('Not Enough Money', `You need $${cost} to purchase this item`);
      return;
    }

    setPurchasing(true);
    try {
      console.log('Sending purchase request...');
      const success = await apiService.purchaseModifier(modifierId, normalizedType);
      console.log('Purchase result:', success);
      
      if (success) {
        // Descontar dinheiro global
        GameStateService.subtractMoney(cost);
        
        // Adicionar modificador ativo
        ModifierService.addActiveModifier(modifier, normalizedType);
        
        Alert.alert(
          'Purchase Successful!', 
          `${modifier.name} has been added to your collection!\n\nEffect: ${modifier.effect}`,
          [{ text: 'OK' }]
        );
        
        // Remover item comprado da loja
        if (normalizedType === 'joker') {
          setJokers(prev => prev.filter(j => j.id !== modifierId));
        } else if (normalizedType === 'planet') {
          setPlanets(prev => prev.filter(p => p.id !== modifierId));
        } else {
          setTarot(prev => prev.filter(t => t.id !== modifierId));
        }
      } else {
        Alert.alert('Purchase Failed', 'Failed to purchase item. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Failed to purchase item');
    } finally {
      setPurchasing(false);
    }
  }, [jokers, planets, tarot, money]);

  const renderTabButton = (tab: 'jokers' | 'planets' | 'tarot', label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, selectedTab === tab && styles.activeTabButton]}
      onPress={() => setSelectedTab(tab)}
    >
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text style={[styles.tabLabel, selectedTab === tab && styles.activeTabLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderModifiers = () => {
    const items = selectedTab === 'jokers' ? jokers : selectedTab === 'planets' ? planets : tarot;
    
    if (items.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No {selectedTab} available</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.modifiersList}>
        {items.map((item) => (
          <ModifierCard
            key={item.id}
            modifier={item}
            type={selectedTab}
            onPress={() => handlePurchase(item.id, selectedTab)}
            showCost={true}
          />
        ))}
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading shop...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Shop</Text>
        <View style={styles.moneyContainer}>
          <Text style={styles.moneyLabel}>Money:</Text>
          <Text style={styles.moneyValue}>${money}</Text>
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back to Game</Text>
      </TouchableOpacity>

      {/* Active Modifiers */}
      <View style={styles.activeModifiersContainer}>
        <Text style={styles.activeModifiersTitle}>Active Modifiers</Text>
        <Text style={styles.activeModifiersCount}>
          {ModifierService.getActiveModifiers().length} active
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {renderTabButton('jokers', 'Jokers', '🃏')}
        {renderTabButton('planets', 'Planets', '🌍')}
        {renderTabButton('tarot', 'Tarot', '🔮')}
      </View>

      {/* Modifiers List */}
      {renderModifiers()}

      {/* Purchase Overlay */}
      {purchasing && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.overlayText}>Processing purchase...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    margin: 8,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  moneyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  moneyLabel: {
    fontSize: 14,
    color: '#cccccc',
    marginRight: 4,
  },
  moneyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  activeModifiersContainer: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    margin: 8,
    borderRadius: 12,
  },
  activeModifiersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  activeModifiersCount: {
    fontSize: 12,
    color: '#4CAF50',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    margin: 8,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#4CAF50',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#cccccc',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modifiersList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
}); 