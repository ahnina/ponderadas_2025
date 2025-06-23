import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const getSuitSymbol = (suit: CardType['suit']) => {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
  }
};

const getSuitColor = (suit: CardType['suit']) => {
  return suit === 'hearts' || suit === 'diamonds' ? '#ff4444' : '#000000';
};

const getCardSize = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small': return { width: 60, height: 80 };
    case 'large': return { width: 100, height: 140 };
    default: return { width: 80, height: 110 };
  }
};

export const Card: React.FC<CardProps> = ({ card, onPress, size = 'medium' }) => {
  const cardSize = getCardSize(size);
  const suitSymbol = getSuitSymbol(card.suit);
  const suitColor = getSuitColor(card.suit);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        cardSize,
        card.isSelected && styles.selectedCard
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.topLeft}>
          <Text style={[styles.rank, { color: suitColor }]}>{card.rank}</Text>
          <Text style={[styles.suit, { color: suitColor }]}>{suitSymbol}</Text>
        </View>
        
        <View style={styles.center}>
          <Text style={[styles.centerSuit, { color: suitColor }]}>{suitSymbol}</Text>
        </View>
        
        <View style={styles.bottomRight}>
          <Text style={[styles.rank, { color: suitColor }]}>{card.rank}</Text>
          <Text style={[styles.suit, { color: suitColor }]}>{suitSymbol}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 4,
  },
  selectedCard: {
    borderColor: '#4CAF50',
    borderWidth: 3,
    transform: [{ translateY: -5 }],
  },
  cardContent: {
    flex: 1,
    padding: 4,
  },
  topLeft: {
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomRight: {
    alignItems: 'flex-end',
    transform: [{ rotate: '180deg' }],
  },
  rank: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  suit: {
    fontSize: 10,
  },
  centerSuit: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 