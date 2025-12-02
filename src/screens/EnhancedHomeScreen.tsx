import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  ActionSheetIOS,
  Alert,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AgentCard } from '../components/AgentCard';
import StorageService from '../services/StorageService';
import { Agent, AgentCategory, AgentStatus } from '../types/Agent';

type SortOption = 'recent' | 'name' | 'category';
type FilterOption = 'all' | AgentStatus;

export const EnhancedHomeScreen = ({ navigation }: any) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | 'all'>('all');

  const loadAgents = async () => {
    setLoading(true);
    const loadedAgents = await StorageService.getAllAgents();
    setAgents(loadedAgents);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadAgents();
    }, [])
  );

  useEffect(() => {
    const channel = StorageService.subscribeToAgents((payload) => {
      console.log('Realtime update:', payload.eventType);
      
      if (payload.eventType === 'INSERT') {
        setAgents((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setAgents((prev) =>
          prev.map((agent) => (agent.id === payload.new.id ? payload.new : agent))
        );
      } else if (payload.eventType === 'DELETE') {
        setAgents((prev) => prev.filter((agent) => agent.id !== payload.old.id));
      }
    });

    return () => {
      StorageService.unsubscribeFromAgents();
    };
  }, []);

  // Filter and sort agents
  useEffect(() => {
    let filtered = [...agents];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((agent) =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((agent) => agent.status === filterStatus);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((agent) => agent.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'category':
        filtered.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
    }

    setFilteredAgents(filtered);
  }, [agents, searchQuery, sortBy, filterStatus, selectedCategory]);

  const handleAgentPress = (agent: Agent) => {
    navigation.navigate('AgentDetail', { agent });
  };

  const handleCreateAgent = () => {
    navigation.navigate('TemplateSelection');
  };

  const handleSortPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Most Recent', 'Name (A-Z)', 'Category'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) setSortBy('recent');
          if (buttonIndex === 2) setSortBy('name');
          if (buttonIndex === 3) setSortBy('category');
        }
      );
    } else {
      Alert.alert('Sort By', 'Choose sorting option', [
        { text: 'Most Recent', onPress: () => setSortBy('recent') },
        { text: 'Name (A-Z)', onPress: () => setSortBy('name') },
        { text: 'Category', onPress: () => setSortBy('category') },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>
        {searchQuery ? '🔍' : '🤖'}
      </Text>
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'No Agents Found' : 'No Agents Yet'}
      </Text>
      <Text style={styles.emptyStateText}>
        {searchQuery 
          ? 'Try adjusting your search or filters'
          : 'Create your first AI agent to get started'
        }
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.emptyStateButton} onPress={handleCreateAgent}>
          <Text style={styles.emptyStateButtonText}>Create Agent</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFilterChip = (label: string, isActive: boolean, onPress: () => void) => (
    <TouchableOpacity
      style={[styles.filterChip, isActive && styles.filterChipActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Agents</Text>
        <View style={styles.headerActions}>
          <Text style={styles.count}>
            {filteredAgents.length} {filteredAgents.length === 1 ? 'agent' : 'agents'}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search agents..."
            placeholderTextColor="#C7C7CC"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
          <Text style={styles.sortIcon}>⇅</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {renderFilterChip('All', filterStatus === 'all', () => setFilterStatus('all'))}
          {renderFilterChip('Active', filterStatus === 'active', () => setFilterStatus('active'))}
          {renderFilterChip('Draft', filterStatus === 'draft', () => setFilterStatus('draft'))}
          {renderFilterChip('Archived', filterStatus === 'archived', () => setFilterStatus('archived'))}
        </ScrollView>
      </View>

      {/* Agent List */}
      <FlatList
        data={filteredAgents}
        renderItem={({ item }) => (
          <AgentCard agent={item} onPress={() => handleAgentPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
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
    paddingBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: {
    fontSize: 15,
    color: '#8E8E93',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  clearButton: {
    fontSize: 18,
    color: '#C7C7CC',
    padding: 4,
  },
  sortButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  sortIcon: {
    fontSize: 20,
    color: '#5856D6',
  },
  filtersContainer: {
    paddingBottom: 12,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterChipActive: {
    backgroundColor: '#5856D6',
    borderColor: '#5856D6',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
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
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: '#5856D6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});

