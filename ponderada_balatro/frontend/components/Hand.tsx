import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card as CardType } from '../types/game';
import { Card } from './Card';

interface HandProps {
  cards: CardType[];
  onCardPress?: (cardId: string) => void;
  title?: string;
  showScore?: boolean;
}

export const Hand: React.FC<HandProps> = ({ 
  cards, 
  onCardPress, 
  title = "Your Hand",
  showScore = true 
}) => {
  const totalScore = cards.reduce((sum, card) => sum + card.value, 0);
  const selectedCards = cards.filter(card => card.isSelected);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showScore && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Score:</Text>
            <Text style={styles.scoreValue}>{totalScore}</Text>
          </View>
        )}
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onPress={() => onCardPress?.(card.id)}
            size="medium"
          />
        ))}
      </ScrollView>
      
      {selectedCards.length > 0 && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedText}>
            Selected: {selectedCards.length} card{selectedCards.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    margin: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#cccccc',
    marginRight: 4,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  cardsContainer: {
    paddingHorizontal: 4,
  },
  selectedInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
}); 