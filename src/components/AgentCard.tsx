import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Agent } from '../types/Agent';
import { getCategoryColor, getCategoryName } from '../data/agentTemplates';

interface AgentCardProps {
  agent: Agent;
  onPress: () => void;
  onLongPress?: () => void;
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'active':
      return '#34C759';
    case 'draft':
      return '#FF9500';
    case 'archived':
      return '#8E8E93';
    default:
      return '#8E8E93';
  }
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'draft':
      return 'Draft';
    case 'archived':
      return 'Archived';
    default:
      return 'Draft';
  }
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onPress, onLongPress }) => {
  const categoryColor = agent.category ? getCategoryColor(agent.category) : '#8E8E93';
  const categoryName = agent.category ? getCategoryName(agent.category) : 'General';
  const iconEmoji = agent.icon || '🤖';

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: categoryColor }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
            <Text style={styles.icon}>{iconEmoji}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {agent.name}
            </Text>
            <Text style={styles.category}>{categoryName}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(agent.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(agent.status)}</Text>
        </View>
      </View>

      {agent.description && (
        <Text style={styles.description} numberOfLines={2}>
          {agent.description}
        </Text>
      )}

      {agent.tags && agent.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {agent.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {agent.tags.length > 3 && (
            <Text style={styles.moreTag}>+{agent.tags.length - 3}</Text>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.date}>
          Updated {new Date(agent.updatedAt).toLocaleDateString()}
        </Text>
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
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  moreTag: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#C7C7CC',
  },
});
