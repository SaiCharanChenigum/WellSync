import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
  SafeAreaView,
  AppState,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from './firebaseConfig';
import { ref, onValue, push, remove } from 'firebase/database';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef();
  const appState = useRef(AppState.currentState);

  const scrollToEnd = (animated = true) => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated });
    }, 50);
  };

  // Load messages and scroll directly to bottom
  useEffect(() => {
    const messagesRef = ref(db, 'messages/');
    const unsubscribe = onValue(messagesRef, snapshot => {
      const data = snapshot.val() || {};
      const loadedMessages = Object.values(data);
      setMessages(loadedMessages);
      scrollToEnd(false); // ⬅️ no animation
    });

    return () => unsubscribe();
  }, []);

  // Detect app close and clear chat
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        remove(ref(db, 'messages/')); // ⬅️ delete all messages
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  const handleSend = () => {
    if (newMessage.trim()) {
      const emojiRegex = /^[\p{Emoji}\s]+$/u;
      const isEmojiOnly = emojiRegex.test(newMessage.trim()) && newMessage.trim().length <= 10;

      const newMsg = {
        text: newMessage.trim(),
        isEmojiOnly,
        sender: Platform.OS === 'ios' ? 'ios' : 'android',
        timestamp: Date.now(),
      };

      push(ref(db, 'messages/'), newMsg);
      setNewMessage('');
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.sender === (Platform.OS === 'ios' ? 'ios' : 'android');

    if (item.isEmojiOnly) {
      return (
        <View style={[styles.emojiContainer, { alignSelf: isMe ? 'flex-end' : 'flex-start' }]}>
          <Text style={styles.emojiOnly}>{item.text}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.messageContainer, { alignSelf: isMe ? 'flex-end' : 'flex-start' }]}>
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.flatList}
          onContentSizeChange={() => scrollToEnd()}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Message..."
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity onPress={handleSend}>
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  flatList: { padding: 13, paddingBottom: 100 },
  messageContainer: { marginBottom: 10 },
  messageBubble: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    maxWidth: '80%',
  },
  messageText: { color: '#fff', fontSize: 17 },
  emojiContainer: { marginBottom: 10 },
  emojiOnly: { fontSize: 45 },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginRight: 10,
    fontSize: 16,
  },
});

export default ChatScreen;
