import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ActionButtonsProps {
  onPlayHand: () => void;
  onDrawCards: () => void;
  onDiscard: () => void;
  onShop: () => void;
  canPlayHand: boolean;
  canDrawCards: boolean;
  canDiscard: boolean;
  money: number;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPlayHand,
  onDrawCards,
  onDiscard,
  onShop,
  canPlayHand,
  canDrawCards,
  canDiscard,
  money
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.moneyContainer}>
        <Text style={styles.moneyLabel}>Money:</Text>
        <Text style={styles.moneyValue}>${money}</Text>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.playButton, !canPlayHand && styles.disabledButton]}
          onPress={onPlayHand}
          disabled={!canPlayHand}
        >
          <Text style={[styles.buttonText, !canPlayHand && styles.disabledText]}>
            Play Hand
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.drawButton, !canDrawCards && styles.disabledButton]}
          onPress={onDrawCards}
          disabled={!canDrawCards}
        >
          <Text style={[styles.buttonText, !canDrawCards && styles.disabledText]}>
            Draw Cards
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.discardButton, !canDiscard && styles.disabledButton]}
          onPress={onDiscard}
          disabled={!canDiscard}
        >
          <Text style={[styles.buttonText, !canDiscard && styles.disabledText]}>
            Discard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.shopButton]}
          onPress={onShop}
        >
          <Text style={styles.buttonText}>
            Shop
          </Text>
        </TouchableOpacity>
      </View>
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
  moneyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
  },
  moneyLabel: {
    fontSize: 16,
    color: '#cccccc',
    marginRight: 8,
  },
  moneyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  drawButton: {
    backgroundColor: '#2196F3',
  },
  discardButton: {
    backgroundColor: '#FF9800',
  },
  shopButton: {
    backgroundColor: '#9C27B0',
  },
  disabledButton: {
    backgroundColor: '#666666',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  disabledText: {
    color: '#999999',
  },
}); 