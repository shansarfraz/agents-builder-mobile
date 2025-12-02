import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AgentCard } from '../components/AgentCard';
import StorageService from '../services/StorageService';
import { Agent } from '../types/Agent';

export const HomeScreen = ({ navigation }: any) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAgents = async () => {
    setLoading(true);
    const loadedAgents = await StorageService.getAllAgents();
    setAgents(loadedAgents);
    setLoading(false);
  };

  // Load agents when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadAgents();
    }, [])
  );

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = StorageService.subscribeToAgents((payload) => {
      console.log('Realtime update:', payload.eventType);
      
      if (payload.eventType === 'INSERT') {
        // Add new agent to the list
        setAgents((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        // Update existing agent
        setAgents((prev) =>
          prev.map((agent) => (agent.id === payload.new.id ? payload.new : agent))
        );
      } else if (payload.eventType === 'DELETE') {
        // Remove deleted agent
        setAgents((prev) => prev.filter((agent) => agent.id !== payload.old.id));
      }
    });

    // Cleanup subscription when component unmounts
    return () => {
      StorageService.unsubscribeFromAgents();
    };
  }, []);

  const handleAgentPress = (agent: Agent) => {
    navigation.navigate('AgentDetail', { agent });
  };

  const handleCreateAgent = () => {
    navigation.navigate('CreateAgent');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🤖</Text>
      <Text style={styles.emptyStateTitle}>No Agents Yet</Text>
      <Text style={styles.emptyStateText}>
        Create your first AI agent to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Agents</Text>
        <Text style={styles.subtitle}>
          {agents.length} {agents.length === 1 ? 'agent' : 'agents'}
        </Text>
      </View>

      <FlatList
        data={agents}
        renderItem={({ item }) => (
          <AgentCard agent={item} onPress={() => handleAgentPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!loading ? renderEmptyState : null}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateAgent}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyStateIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5856D6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});



