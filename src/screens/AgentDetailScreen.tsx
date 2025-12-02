import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StorageService from '../services/StorageService';
import { useTheme } from '../theme/ThemeContext';
import { getCategoryColor, getCategoryName } from '../data/agentTemplates';

export const AgentDetailScreen = ({ navigation, route }: any) => {
  const { agent } = route.params;
  const { colors, isDark } = useTheme();

  const handleEdit = () => {
    navigation.navigate('CreateAgentWizard', { agent });
  };

  const handlePreview = () => {
    navigation.navigate('AgentPreview', { agent });
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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        <View style={[styles.contentBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.content, { color: colors.text }]}>{content}</Text>
        </View>
      </View>
    );
  };

  const categoryColor = agent.category ? getCategoryColor(agent.category) : colors.primary;
  const categoryName = agent.category ? getCategoryName(agent.category) : 'General';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
            <Text style={[styles.editButton, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <Text style={[styles.deleteButton, { color: colors.error }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Agent Header */}
        <View style={styles.headerSection}>
          <View style={styles.iconRow}>
            <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
              <Text style={styles.icon}>{agent.icon || '🤖'}</Text>
            </View>
            <View style={[styles.statusBadge, { 
              backgroundColor: agent.status === 'active' ? colors.success : 
                             agent.status === 'archived' ? colors.textSecondary : colors.warning 
            }]}>
              <Text style={[styles.statusText, { color: colors.textInverse }]}>
                {agent.status || 'draft'}
              </Text>
            </View>
          </View>

          <Text style={[styles.agentName, { color: colors.text }]}>{agent.name}</Text>
          
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>{categoryName}</Text>
          </View>

          {agent.description && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>{agent.description}</Text>
          )}

          {agent.tags && agent.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {agent.tags.map((tag: string, index: number) => (
                <View key={index} style={[styles.tag, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.tagText, { color: colors.textSecondary }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={[styles.date, { color: colors.textTertiary }]}>
            Last updated: {new Date(agent.updatedAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Preview Button */}
        <TouchableOpacity
          style={[styles.previewButton, { backgroundColor: colors.primary }]}
          onPress={handlePreview}
        >
          <Text style={styles.previewIcon}>💬</Text>
          <Text style={[styles.previewButtonText, { color: colors.textInverse }]}>Test Agent in Preview</Text>
        </TouchableOpacity>

        {/* Content Sections */}
        {renderSection('Context', agent.context)}
        {renderSection('Instructions', agent.instructions)}
        {renderSection('Knowledge', agent.knowledge)}

        {!agent.context && !agent.instructions && !agent.knowledge && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              No additional details have been added to this agent yet.
            </Text>
            <TouchableOpacity style={[styles.addDetailsButton, { backgroundColor: colors.primary }]} onPress={handleEdit}>
              <Text style={[styles.addDetailsButtonText, { color: colors.textInverse }]}>Add Details</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    fontSize: 28,
    fontWeight: '300',
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
    fontWeight: '600',
  },
  deleteButton: {
    fontSize: 17,
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
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 36,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  agentName: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  description: {
    fontSize: 17,
    marginBottom: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  date: {
    fontSize: 13,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  previewIcon: {
    fontSize: 20,
  },
  previewButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  contentBox: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  addDetailsButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addDetailsButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
