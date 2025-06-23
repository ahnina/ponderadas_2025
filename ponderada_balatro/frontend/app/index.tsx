import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Hand } from '../components/Hand';
import { ActionButtons } from '../components/ActionButtons';
import { ActiveModifiersDisplay } from '../components/ActiveModifiersDisplay';
import { apiService } from '../services/api';
import { ModifierService } from '../services/modifierService';
import { GameStateService } from '../services/gameStateService';
import { GameState, Card } from '../types/game';

export default function GameScreen() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [money, setMoney] = useState(GameStateService.getMoney());

  useEffect(() => {
    console.log('GameScreen: Component mounted');
    initializeGame();
    
    // Sincronizar dinheiro com o servidor
    GameStateService.syncMoneyFromServer();
    
    // Escutar mudanças no dinheiro
    const unsubscribe = GameStateService.addListener((newMoney) => {
      setMoney(newMoney);
    });
    
    return unsubscribe;
  }, []);

  const initializeGame = async () => {
    try {
      console.log('GameScreen: Initializing game...');
      setLoading(true);
      setError(null);
      
      // Test health check first
      console.log('GameScreen: Testing API health...');
      const isHealthy = await apiService.healthCheck();
      console.log('GameScreen: API health check result:', isHealthy);
      
      if (!isHealthy) {
        throw new Error('Backend is not responding');
      }
      
      console.log('GameScreen: Getting initial game state...');
      const initialState = await apiService.getInitialGameState();
      console.log('GameScreen: Initial state received:', initialState);
      
      // Aplicar modificadores ativos às cartas
      const modifiedHand = ModifierService.applyModifiersToCards(initialState.currentHand);
      const modifiedDeck = ModifierService.applyModifiersToCards(initialState.deck);
      
      setGameState({
        ...initialState,
        currentHand: modifiedHand,
        deck: modifiedDeck
      });
      
      // Sincronizar dinheiro do servidor
      GameStateService.setMoney(initialState.money);
    } catch (error) {
      console.error('GameScreen: Error initializing game:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      Alert.alert('Error', 'Failed to initialize game. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (cardId: string) => {
    if (!gameState || playing) return;

    setGameState(prev => {
      if (!prev) return prev;
      
      const updatedHand = prev.currentHand.map(card =>
        card.id === cardId ? { ...card, isSelected: !card.isSelected } : card
      );
      
      return { ...prev, currentHand: updatedHand };
    });
  };

  const handlePlayHand = async () => {
    if (!gameState || playing) return;
    
    const selectedCards = gameState.currentHand.filter(card => card.isSelected);
    if (selectedCards.length === 0) {
      Alert.alert('No Cards Selected', 'Please select cards to play');
      return;
    }

    setPlaying(true);
    try {
      const result = await apiService.playHand(selectedCards);
      
      // Aplicar multiplicadores de pontuação
      const scoreMultiplier = ModifierService.calculateScoreMultiplier();
      const finalScore = Math.floor(result.score * scoreMultiplier);
      const finalMoney = Math.floor(finalScore / 10);
      
      setGameState(prev => {
        if (!prev) return prev;
        
        const newScore = prev.score + finalScore;
        const newHand = prev.currentHand.filter(card => !card.isSelected);
        
        return {
          ...prev,
          score: newScore,
          currentHand: newHand,
          discardPile: [...prev.discardPile, ...selectedCards]
        };
      });

      // Atualizar dinheiro global
      GameStateService.addMoney(finalMoney);

      const multiplierText = scoreMultiplier > 1 ? `\nMultiplier: x${scoreMultiplier.toFixed(1)}` : '';
      Alert.alert(
        'Hand Played!',
        `Score: +${finalScore}${multiplierText}\nMoney: +${finalMoney}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to play hand');
    } finally {
      setPlaying(false);
    }
  };

  const handleDrawCards = async () => {
    if (!gameState || playing) return;
    
    const cardsToDraw = Math.min(3, 8 - gameState.currentHand.length);
    if (cardsToDraw <= 0) {
      Alert.alert('Hand Full', 'Your hand is already full');
      return;
    }

    setPlaying(true);
    try {
      const newCards = await apiService.drawCards(cardsToDraw);
      
      // Aplicar modificadores às novas cartas
      const modifiedNewCards = ModifierService.applyModifiersToCards(newCards);
      
      setGameState(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          currentHand: [...prev.currentHand, ...modifiedNewCards],
          deck: prev.deck.slice(cardsToDraw)
        };
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to draw cards');
    } finally {
      setPlaying(false);
    }
  };

  const handleDiscard = () => {
    if (!gameState || playing) return;
    
    const selectedCards = gameState.currentHand.filter(card => card.isSelected);
    if (selectedCards.length === 0) {
      Alert.alert('No Cards Selected', 'Please select cards to discard');
      return;
    }

    setGameState(prev => {
      if (!prev) return prev;
      
      const newHand = prev.currentHand.filter(card => !card.isSelected);
      return {
        ...prev,
        currentHand: newHand,
        discardPile: [...prev.discardPile, ...selectedCards]
      };
    });
  };

  const handleShop = () => {
    router.push('/shop');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading game...</Text>
        {error && (
          <Text style={styles.errorText}>Error: {error}</Text>
        )}
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load game</Text>
        <Text style={styles.errorDetails}>{error}</Text>
        <Text style={styles.retryText}>Please check if the backend is running on port 3001</Text>
      </SafeAreaView>
    );
  }

  if (!gameState) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load game</Text>
      </SafeAreaView>
    );
  }

  const selectedCards = gameState.currentHand.filter(card => card.isSelected);
  const canPlayHand = selectedCards.length > 0 && !playing;
  const canDrawCards = gameState.currentHand.length < 8 && !playing;
  const canDiscard = selectedCards.length > 0 && !playing;
  const activeModifiers = ModifierService.getActiveModifiers();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Game Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Balatro Clone</Text>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={styles.statValue}>{gameState.score}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Round</Text>
              <Text style={styles.statValue}>{gameState.round}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Deck</Text>
              <Text style={styles.statValue}>{gameState.deck.length}</Text>
            </View>
          </View>
        </View>

        {/* Player's Hand */}
        <Hand
          cards={gameState.currentHand}
          onCardPress={handleCardPress}
          title="Your Hand"
          showScore={true}
        />

        {/* Action Buttons */}
        <ActionButtons
          onPlayHand={handlePlayHand}
          onDrawCards={handleDrawCards}
          onDiscard={handleDiscard}
          onShop={handleShop}
          canPlayHand={canPlayHand}
          canDrawCards={canDrawCards}
          canDiscard={canDiscard}
          money={money}
        />

        {/* Active Modifiers */}
        <ActiveModifiersDisplay
          modifiers={activeModifiers}
        />

        {/* Discard Pile */}
        {gameState.discardPile.length > 0 && (
          <View style={styles.discardContainer}>
            <Text style={styles.discardTitle}>Discard Pile ({gameState.discardPile.length})</Text>
          </View>
        )}
      </ScrollView>

      {playing && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.overlayText}>Processing...</Text>
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
  scrollView: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDetails: {
    color: '#cccccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    margin: 8,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#cccccc',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  discardContainer: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    margin: 8,
    borderRadius: 12,
  },
  discardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
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
}); 