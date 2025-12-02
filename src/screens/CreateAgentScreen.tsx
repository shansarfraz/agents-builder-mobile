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

export const CreateAgentScreen = ({ navigation, route }: any) => {
  const agent = route.params?.agent;
  const isEditing = !!agent;

  const [name, setName] = useState(agent?.name || '');
  const [description, setDescription] = useState(agent?.description || '');
  const [context, setContext] = useState(agent?.context || '');
  const [instructions, setInstructions] = useState(agent?.instructions || '');
  const [knowledge, setKnowledge] = useState(agent?.knowledge || '');
  const [saving, setSaving] = useState(false);

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
        });
        Alert.alert('Success', 'Agent updated successfully');
      } else {
        await StorageService.createAgent({
          name,
          description,
          context,
          instructions,
          knowledge,
        });
        Alert.alert('Success', 'Agent created successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save agent. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{isEditing ? 'Edit Agent' : 'New Agent'}</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            <Text style={[styles.saveButton, saving && styles.saveButtonDisabled]}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter agent name"
              placeholderTextColor="#C7C7CC"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description of what this agent does"
              placeholderTextColor="#C7C7CC"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Context</Text>
            <Text style={styles.helpText}>
              Provide background information about the agent's role and purpose
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={context}
              onChangeText={setContext}
              placeholder="Example: You are a helpful customer service agent..."
              placeholderTextColor="#C7C7CC"
              multiline
              numberOfLines={5}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Instructions</Text>
            <Text style={styles.helpText}>
              Define how the agent should behave and respond
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Example: Always be polite and professional..."
              placeholderTextColor="#C7C7CC"
              multiline
              numberOfLines={5}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Knowledge</Text>
            <Text style={styles.helpText}>
              Add specific information the agent should know
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={knowledge}
              onChangeText={setKnowledge}
              placeholder="Example: Our business hours are 9-5 EST..."
              placeholderTextColor="#C7C7CC"
              multiline
              numberOfLines={5}
            />
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cancelButton: {
    fontSize: 17,
    color: '#8E8E93',
  },
  saveButton: {
    fontSize: 17,
    fontWeight: '600',
    color: '#5856D6',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bottomPadding: {
    height: 40,
  },
});



