import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StorageService from '../services/StorageService';

export const AgentDetailScreen = ({ navigation, route }: any) => {
  const { agent } = route.params;

  const handleEdit = () => {
    navigation.navigate('CreateAgent', { agent });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Agent',
      `Are you sure you want to delete "${agent.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteAgent(agent.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const renderSection = (title: string, content: string) => {
    if (!content) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.contentBox}>
          <Text style={styles.content}>{content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.agentName}>{agent.name}</Text>
          {agent.description && (
            <Text style={styles.description}>{agent.description}</Text>
          )}
          <Text style={styles.date}>
            Last updated: {new Date(agent.updatedAt).toLocaleDateString()}
          </Text>
        </View>

        {renderSection('Context', agent.context)}
        {renderSection('Instructions', agent.instructions)}
        {renderSection('Knowledge', agent.knowledge)}

        {!agent.context && !agent.instructions && !agent.knowledge && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No additional details have been added to this agent yet.
            </Text>
            <TouchableOpacity style={styles.addDetailsButton} onPress={handleEdit}>
              <Text style={styles.addDetailsButtonText}>Add Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    fontSize: 17,
    color: '#5856D6',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    paddingVertical: 4,
  },
  editButton: {
    fontSize: 17,
    color: '#5856D6',
    fontWeight: '600',
  },
  deleteButton: {
    fontSize: 17,
    color: '#FF3B30',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 24,
  },
  agentName: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  description: {
    fontSize: 17,
    color: '#666',
    marginBottom: 12,
    lineHeight: 24,
  },
  date: {
    fontSize: 13,
    color: '#8E8E93',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  content: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
  },
  addDetailsButton: {
    backgroundColor: '#5856D6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addDetailsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});



