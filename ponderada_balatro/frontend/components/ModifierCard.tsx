import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Joker, Planet, Tarot } from '../types/game';

interface ModifierCardProps {
  modifier: Joker | Planet | Tarot;
  type: 'joker' | 'planet' | 'tarot';
  onPress: () => void;
  showCost?: boolean;
}

export const ModifierCard: React.FC<ModifierCardProps> = ({
  modifier,
  type,
  onPress,
  showCost = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'joker':
        return '🃏';
      case 'planet':
        return '🌍';
      case 'tarot':
        return '🔮';
      default:
        return '❓';
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'common':
        return '#cccccc';
      case 'uncommon':
        return '#4CAF50';
      case 'rare':
        return '#2196F3';
      case 'legendary':
        return '#FF9800';
      default:
        return '#cccccc';
    }
  };

  const getCost = () => {
    if ('cost' in modifier) {
      return modifier.cost;
    }
    switch (type) {
      case 'planet':
        return 3;
      case 'tarot':
        return 2;
      default:
        return 2;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.icon}>{getIcon()}</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{modifier.name}</Text>
          {'rarity' in modifier && (
            <Text style={[styles.rarity, { color: getRarityColor(modifier.rarity) }]}>
              {modifier.rarity}
            </Text>
          )}
        </View>
        {showCost && (
          <View style={styles.costContainer}>
            <Text style={styles.costLabel}>Cost:</Text>
            <Text style={styles.costValue}>${getCost()}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.description}>{modifier.description}</Text>
      
      <View style={styles.effectContainer}>
        <Text style={styles.effectLabel}>Effect:</Text>
        <Text style={styles.effect}>{modifier.effect}</Text>
      </View>

      {'multiplier' in modifier && (
        <View style={styles.multiplierContainer}>
          <Text style={styles.multiplierLabel}>Multiplier:</Text>
          <Text style={styles.multiplierValue}>x{modifier.multiplier}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  rarity: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  costContainer: {
    alignItems: 'flex-end',
  },
  costLabel: {
    fontSize: 10,
    color: '#cccccc',
    marginBottom: 2,
  },
  costValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  description: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 12,
    lineHeight: 20,
  },
  effectContainer: {
    backgroundColor: '#3a3a3a',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  effectLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
    fontWeight: '500',
  },
  effect: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '500',
  },
  multiplierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 8,
    borderRadius: 6,
  },
  multiplierLabel: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  multiplierValue: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: 'bold',
  },
}); 