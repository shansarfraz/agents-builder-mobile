import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StorageService from '../services/StorageService';
import { AgentCategory, AgentStatus } from '../types/Agent';
import { getCategoryColor } from '../data/agentTemplates';

const STEPS = [
  { id: 1, title: 'Basic Info', subtitle: 'Name and description' },
  { id: 2, title: 'Context', subtitle: 'Role and purpose' },
  { id: 3, title: 'Instructions', subtitle: 'How it should behave' },
  { id: 4, title: 'Knowledge', subtitle: 'What it should know' },
  { id: 5, title: 'Review', subtitle: 'Finalize and create' },
];

const CATEGORY_OPTIONS: { value: AgentCategory; label: string; icon: string }[] = [
  { value: 'customer-support', label: 'Customer Support', icon: '💬' },
  { value: 'sales', label: 'Sales', icon: '💼' },
  { value: 'content', label: 'Content', icon: '✍️' },
  { value: 'analysis', label: 'Analysis', icon: '📊' },
  { value: 'development', label: 'Development', icon: '👨‍💻' },
  { value: 'general', label: 'General', icon: '🤖' },
];

export const CreateAgentWizardScreen = ({ navigation, route }: any) => {
  const template = route.params?.template;
  const agent = route.params?.agent;
  const isEditing = !!agent;

  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState(agent?.name || template?.name || '');
  const [description, setDescription] = useState(agent?.description || template?.description || '');
  const [category, setCategory] = useState<AgentCategory>(
    agent?.category || template?.category || 'general'
  );
  const [context, setContext] = useState(agent?.context || template?.context || '');
  const [instructions, setInstructions] = useState(agent?.instructions || template?.instructions || '');
  const [knowledge, setKnowledge] = useState(agent?.knowledge || template?.knowledge || '');
  const [tags, setTags] = useState<string[]>(agent?.tags || template?.tags || []);
  const [status, setStatus] = useState<AgentStatus>(agent?.status || 'draft');
  const [saving, setSaving] = useState(false);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return context.trim().length > 0;
      case 3:
        return instructions.trim().length > 0;
      case 4:
        return true; // Knowledge is optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your agent');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await StorageService.updateAgent(agent.id, {
          name,
          description,
          context,
          instructions,
          knowledge,
          category,
          status,
          tags,
        });
        Alert.alert('Success', 'Agent updated successfully');
      } else {
        await StorageService.createAgent({
          name,
          description,
          context,
          instructions,
          knowledge,
          category,
          status,
          tags,
        });
        Alert.alert('Success', 'Agent created successfully');
      }
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving agent:', error);
      Alert.alert(
        'Error', 
        `Failed to save agent. ${error instanceof Error ? error.message : 'Please check your connection and try again.'}`
      );
    } finally {
      setSaving(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step, index) => (
        <View key={step.id} style={styles.stepItem}>
          <View
            style={[
              styles.stepDot,
              currentStep >= step.id && styles.stepDotActive,
              currentStep === step.id && styles.stepDotCurrent,
            ]}
          >
            {currentStep > step.id && <Text style={styles.checkmark}>✓</Text>}
            {currentStep === step.id && <Text style={styles.stepNumber}>{step.id}</Text>}
            {currentStep < step.id && <Text style={styles.stepNumberInactive}>{step.id}</Text>}
          </View>
          {index < STEPS.length - 1 && (
            <View style={[styles.stepLine, currentStep > step.id && styles.stepLineActive]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{STEPS[0].title}</Text>
      <Text style={styles.stepSubtitle}>{STEPS[0].subtitle}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Customer Support Assistant"
          placeholderTextColor="#C7C7CC"
          autoFocus
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Brief description of what this agent does..."
          placeholderTextColor="#C7C7CC"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORY_OPTIONS.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryOption,
                category === cat.value && styles.categoryOptionActive,
                { borderColor: getCategoryColor(cat.value) },
              ]}
              onPress={() => setCategory(cat.value)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={[
                styles.categoryLabel,
                category === cat.value && styles.categoryLabelActive,
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{STEPS[1].title}</Text>
      <Text style={styles.stepSubtitle}>{STEPS[1].subtitle}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Context *</Text>
        <Text style={styles.helpText}>
          Provide background information about the agent's role and purpose
        </Text>
        <TextInput
          style={[styles.input, styles.textAreaLarge]}
          value={context}
          onChangeText={setContext}
          placeholder="Example: You are a professional customer service agent for a B2B SaaS company..."
          placeholderTextColor="#C7C7CC"
          multiline
          numberOfLines={8}
          autoFocus
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{STEPS[2].title}</Text>
      <Text style={styles.stepSubtitle}>{STEPS[2].subtitle}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Instructions *</Text>
        <Text style={styles.helpText}>
          Define how the agent should behave and respond
        </Text>
        <TextInput
          style={[styles.input, styles.textAreaLarge]}
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Example: Always be polite and professional. Ask clarifying questions when needed..."
          placeholderTextColor="#C7C7CC"
          multiline
          numberOfLines={8}
          autoFocus
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{STEPS[3].title}</Text>
      <Text style={styles.stepSubtitle}>{STEPS[3].subtitle}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Knowledge (Optional)</Text>
        <Text style={styles.helpText}>
          Add specific information the agent should know
        </Text>
        <TextInput
          style={[styles.input, styles.textAreaLarge]}
          value={knowledge}
          onChangeText={setKnowledge}
          placeholder="Example: Our business hours are 9-5 EST. We offer 24/7 support for enterprise customers..."
          placeholderTextColor="#C7C7CC"
          multiline
          numberOfLines={8}
          autoFocus
        />
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{STEPS[4].title}</Text>
      <Text style={styles.stepSubtitle}>Review your agent configuration</Text>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewLabel}>Name</Text>
        <Text style={styles.reviewValue}>{name}</Text>
      </View>

      {description && (
        <View style={styles.reviewCard}>
          <Text style={styles.reviewLabel}>Description</Text>
          <Text style={styles.reviewValue}>{description}</Text>
        </View>
      )}

      <View style={styles.reviewCard}>
        <Text style={styles.reviewLabel}>Category</Text>
        <Text style={styles.reviewValue}>
          {CATEGORY_OPTIONS.find(c => c.value === category)?.label}
        </Text>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewLabel}>Context</Text>
        <Text style={styles.reviewValue} numberOfLines={3}>
          {context}
        </Text>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewLabel}>Instructions</Text>
        <Text style={styles.reviewValue} numberOfLines={3}>
          {instructions}
        </Text>
      </View>

      {knowledge && (
        <View style={styles.reviewCard}>
          <Text style={styles.reviewLabel}>Knowledge</Text>
          <Text style={styles.reviewValue} numberOfLines={3}>
            {knowledge}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.statusOptions}>
          <TouchableOpacity
            style={[styles.statusOption, status === 'draft' && styles.statusOptionActive]}
            onPress={() => setStatus('draft')}
          >
            <Text style={[styles.statusLabel, status === 'draft' && styles.statusLabelActive]}>
              📝 Draft
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statusOption, status === 'active' && styles.statusOptionActive]}
            onPress={() => setStatus('active')}
          >
            <Text style={[styles.statusLabel, status === 'active' && styles.statusLabelActive]}>
              ✅ Active
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backButton}>{currentStep === 1 ? 'Cancel' : '‹ Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Step {currentStep} of {STEPS.length}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {renderStepIndicator()}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderCurrentStep()}
        </ScrollView>

        <View style={styles.footer}>
          {currentStep < STEPS.length ? (
            <TouchableOpacity
              style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
              onPress={handleNext}
              disabled={!canProceed()}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextButton, saving && styles.nextButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.nextButtonText}>
                {saving ? 'Creating...' : isEditing ? 'Update Agent' : 'Create Agent'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  keyboardView: {
    flex: 1,
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
  },
  backButton: {
    fontSize: 17,
    color: '#5856D6',
    width: 80,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8E8E93',
  },
  placeholder: {
    width: 80,
  },
  stepIndicator: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F7',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    borderColor: '#5856D6',
    backgroundColor: '#5856D6',
  },
  stepDotCurrent: {
    backgroundColor: '#5856D6',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepNumberInactive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C7C7CC',
  },
  checkmark: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#5856D6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 8,
    lineHeight: 18,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    minHeight: 160,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  categoryOptionActive: {
    borderWidth: 2,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  reviewLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  reviewValue: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 22,
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  statusOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  statusOptionActive: {
    borderColor: '#5856D6',
    backgroundColor: '#5856D6',
  },
  statusLabel: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
  statusLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
  nextButton: {
    backgroundColor: '#5856D6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

