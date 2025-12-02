import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Agent } from '../types/Agent';
import { useTheme } from '../theme/ThemeContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const SAMPLE_PROMPTS = [
  "Tell me about yourself",
  "What can you help me with?",
  "How do you work?",
  "What are your capabilities?",
];

export const AgentPreviewScreen = ({ route, navigation }: any) => {
  const agent: Agent = route.params?.agent;
  const { colors, isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Welcome message
    addBotMessage(`Hi! I'm ${agent.name}. ${agent.description || 'How can I help you today?'}`);
  }, []);

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const simulateAgentResponse = (userMessage: string) => {
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      let response = `I understand you're asking about "${userMessage}".\n\n`;
      
      // Generate contextual response based on agent configuration
      if (agent.context) {
        response += `Based on my role: ${agent.context.substring(0, 150)}...\n\n`;
      }
      
      if (agent.instructions) {
        response += `Following my guidelines: ${agent.instructions.substring(0, 150)}...\n\n`;
      }
      
      response += `This is a preview mode. In production, I would provide detailed responses based on my knowledge base.`;

      addBotMessage(response);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      addUserMessage(inputText);
      simulateAgentResponse(inputText);
      setInputText('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handlePromptPress = (prompt: string) => {
    setInputText(prompt);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.botMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isUser 
            ? { ...styles.userBubble, backgroundColor: colors.primary }
            : { ...styles.botBubble, backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: item.isUser ? colors.textInverse : colors.text },
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            { color: item.isUser ? colors.textInverse + '99' : colors.textSecondary },
          ]}
        >
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.botMessageContainer]}>
      <View style={[styles.messageBubble, styles.botBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.typingDots}>
          <View style={[styles.dot, { backgroundColor: colors.textSecondary }]} />
          <View style={[styles.dot, { backgroundColor: colors.textSecondary }]} />
          <View style={[styles.dot, { backgroundColor: colors.textSecondary }]} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backButton, { color: colors.primary }]}>‹ Back</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.agentName, { color: colors.text }]}>{agent.name}</Text>
            <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Preview Mode</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Sample Prompts */}
        {messages.length <= 1 && (
          <View style={styles.promptsContainer}>
            <Text style={[styles.promptsTitle, { color: colors.textSecondary }]}>Try asking:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsScroll}>
              {SAMPLE_PROMPTS.map((prompt, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.promptChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => handlePromptPress(prompt)}
                >
                  <Text style={[styles.promptText, { color: colors.text }]}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          ListFooterComponent={isTyping ? renderTypingIndicator : null}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input Bar */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={500}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? colors.primary : colors.border },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isTyping}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    fontSize: 28,
    fontWeight: '300',
    width: 60,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  agentName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  placeholder: {
    width: 60,
  },
  promptsContainer: {
    paddingVertical: 16,
  },
  promptsTitle: {
    fontSize: 13,
    fontWeight: '500',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  promptsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  promptChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  promptText: {
    fontSize: 14,
    fontWeight: '500',
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '500',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  input: {
    fontSize: 16,
    lineHeight: 22,
    maxHeight: 80,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

