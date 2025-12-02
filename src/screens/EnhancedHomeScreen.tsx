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
import { useTheme } from '../theme/ThemeContext';

type SortOption = 'recent' | 'name' | 'category';
type FilterOption = 'all' | AgentStatus;

export const EnhancedHomeScreen = ({ navigation }: any) => {
  const { colors, isDark, toggleTheme } = useTheme();
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
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        {searchQuery ? 'No Agents Found' : 'No Agents Yet'}
      </Text>
      <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
        {searchQuery 
          ? 'Try adjusting your search or filters'
          : 'Create your first AI agent to get started'
        }
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={[styles.emptyStateButton, { backgroundColor: colors.primary }]} onPress={handleCreateAgent}>
          <Text style={[styles.emptyStateButtonText, { color: colors.textInverse }]}>Create Agent</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFilterChip = (label: string, isActive: boolean, onPress: () => void) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        { backgroundColor: colors.card, borderColor: colors.border },
        isActive && { backgroundColor: colors.primary, borderColor: colors.primary }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterChipText,
        { color: colors.textSecondary },
        isActive && { color: colors.textInverse }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>My Agents</Text>
          <Text style={[styles.count, { color: colors.textSecondary }]}>
            {filteredAgents.length} {filteredAgents.length === 1 ? 'agent' : 'agents'}
          </Text>
        </View>
        <TouchableOpacity onPress={toggleTheme} style={[styles.themeButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search agents..."
            placeholderTextColor={colors.textTertiary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearButton, { color: colors.textTertiary }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={[styles.sortButton, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={handleSortPress}>
          <Text style={[styles.sortIcon, { color: colors.primary }]}>⇅</Text>
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
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleCreateAgent}
        activeOpacity={0.8}
      >
        <Text style={[styles.fabIcon, { color: colors.textInverse }]}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 4,
  },
  count: {
    fontSize: 15,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  themeIcon: {
    fontSize: 20,
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
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
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
  },
  clearButton: {
    fontSize: 18,
    padding: 4,
  },
  sortButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
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
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
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
    fontWeight: '300',
  },
});

