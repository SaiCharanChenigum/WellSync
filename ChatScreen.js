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
import * as Animatable from 'react-native-animatable';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef();
  const appState = useRef(AppState.currentState);

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false }); // no scroll animation
    }, 20);
  };

  useEffect(() => {
    const messagesRef = ref(db, 'messages/');
    const unsubscribe = onValue(messagesRef, snapshot => {
      const data = snapshot.val() || {};
      const loadedMessages = Object.values(data);
      setMessages(loadedMessages);
      scrollToEnd();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        remove(ref(db, 'messages/'));
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  const handleSend = () => {
    if (newMessage.trim()) {
      const emojiRegex = /^[^a-zA-Z0-9]*$/;
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
    const bubbleStyle = isMe ? styles.myBubble : styles.otherBubble;
    const textStyle = isMe ? styles.myText : styles.otherText;

    if (item.isEmojiOnly) {
      return (
        <Animatable.View animation="fadeInUp" duration={200} style={[
          styles.emojiContainer,
          { alignSelf: isMe ? 'flex-end' : 'flex-start' }
        ]}>
          <Text style={styles.emojiOnly}>{item.text}</Text>
        </Animatable.View>
      );
    }

    return (
      <Animatable.View animation="fadeInUp" duration={200} style={[
        styles.messageContainer,
        { alignSelf: isMe ? 'flex-end' : 'flex-start' }
      ]}>
        <View style={bubbleStyle}>
          <Text style={textStyle}>{item.text}</Text>
        </View>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.flatList}
          onContentSizeChange={scrollToEnd}
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
  myBubble: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    maxWidth: '80%',
  },
  otherBubble: {
    backgroundColor: '#E5E5EA',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    maxWidth: '80%',
  },
  myText: { color: '#fff', fontSize: 17 },
  otherText: { color: '#000', fontSize: 17 },
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
