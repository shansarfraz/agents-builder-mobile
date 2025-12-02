import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Agent } from '../types/Agent';

interface AgentCardProps {
  agent: Agent;
  onPress: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{agent.name}</Text>
        <Text style={styles.date}>
          {new Date(agent.updatedAt).toLocaleDateString()}
        </Text>
      </View>
      {agent.description && (
        <Text style={styles.description} numberOfLines={2}>
          {agent.description}
        </Text>
      )}
      <View style={styles.tags}>
        {agent.context && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>Context</Text>
          </View>
        )}
        {agent.instructions && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>Instructions</Text>
          </View>
        )}
        {agent.knowledge && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>Knowledge</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F0F0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#5856D6',
    fontWeight: '600',
  },
});



