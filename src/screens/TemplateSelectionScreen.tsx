import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { agentTemplates } from '../data/agentTemplates';
import { AgentTemplate } from '../types/Agent';

export const TemplateSelectionScreen = ({ navigation }: any) => {
  const handleTemplateSelect = (template: AgentTemplate) => {
    navigation.navigate('CreateAgentWizard', { template });
  };

  const handleStartFromScratch = () => {
    navigation.navigate('CreateAgentWizard', { template: null });
  };

  const renderTemplate = (template: AgentTemplate) => (
    <TouchableOpacity
      key={template.id}
      style={[styles.templateCard, { borderLeftColor: template.color }]}
      onPress={() => handleTemplateSelect(template)}
      activeOpacity={0.7}
    >
      <View style={styles.templateHeader}>
        <View style={[styles.iconContainer, { backgroundColor: template.color + '20' }]}>
          <Text style={styles.icon}>{template.icon}</Text>
        </View>
        <View style={styles.templateInfo}>
          <Text style={styles.templateName}>{template.name}</Text>
          <Text style={styles.templateDescription}>{template.description}</Text>
        </View>
      </View>
      <View style={styles.tagsContainer}>
        {template.tags.slice(0, 3).map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Choose Template</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Start from a Template</Text>
        <Text style={styles.sectionSubtitle}>
          Choose a pre-configured agent template and customize it to your needs
        </Text>

        {agentTemplates.map(renderTemplate)}

        <TouchableOpacity
          style={styles.scratchCard}
          onPress={handleStartFromScratch}
          activeOpacity={0.7}
        >
          <View style={styles.scratchIconContainer}>
            <Text style={styles.scratchIcon}>✨</Text>
          </View>
          <View style={styles.scratchInfo}>
            <Text style={styles.scratchTitle}>Start from Scratch</Text>
            <Text style={styles.scratchDescription}>
              Build a custom agent with your own configuration
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    fontSize: 28,
    color: '#5856D6',
    fontWeight: '300',
    width: 60,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 24,
    lineHeight: 21,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  templateHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 28,
  },
  templateInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  templateName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  scratchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
  },
  scratchIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  scratchIcon: {
    fontSize: 24,
  },
  scratchInfo: {
    flex: 1,
  },
  scratchTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  scratchDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  arrow: {
    fontSize: 28,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  bottomPadding: {
    height: 40,
  },
});

