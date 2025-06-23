import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ActiveModifier } from '../types/game';

interface ActiveModifiersDisplayProps {
  modifiers: ActiveModifier[];
}

export const ActiveModifiersDisplay: React.FC<ActiveModifiersDisplayProps> = ({ modifiers }) => {
  if (modifiers.length === 0) {
    return null;
  }

  const getEffectIcon = (type: string) => {
    switch (type) {
      case 'multiplier':
        return '✖️';
      case 'bonus':
        return '➕';
      case 'transform':
        return '🔄';
      case 'special':
        return '✨';
      default:
        return '❓';
    }
  };

  const getTypeIcon = (type: string) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Modifiers ({modifiers.length})</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {modifiers.map((modifier) => (
          <View key={modifier.id} style={styles.modifierCard}>
            <View style={styles.header}>
              <Text style={styles.typeIcon}>{getTypeIcon(modifier.type)}</Text>
              <Text style={styles.effectIcon}>{getEffectIcon(modifier.effect.type)}</Text>
            </View>
            <Text style={styles.name}>{modifier.name}</Text>
            <Text style={styles.effect}>{modifier.effect.description}</Text>
            <View style={styles.details}>
              <Text style={styles.detailText}>
                Type: {modifier.effect.type}
              </Text>
              <Text style={styles.detailText}>
                Value: {modifier.effect.value}
              </Text>
              {modifier.effect.target && (
                <Text style={styles.detailText}>
                  Target: {modifier.effect.target}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    margin: 8,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  modifierCard: {
    backgroundColor: '#3a3a3a',
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    minWidth: 150,
    borderWidth: 1,
    borderColor: '#4a4a4a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIcon: {
    fontSize: 16,
  },
  effectIcon: {
    fontSize: 14,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  effect: {
    fontSize: 12,
    color: '#cccccc',
    marginBottom: 8,
    lineHeight: 16,
  },
  details: {
    backgroundColor: '#1a1a1a',
    padding: 6,
    borderRadius: 4,
  },
  detailText: {
    fontSize: 10,
    color: '#888888',
    marginBottom: 2,
  },
}); 