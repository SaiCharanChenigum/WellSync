import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './ChatScreen';
import HealthApp from './HealthApp';
import ProfileScreen from './ProfileScreen';
import { db } from './firebaseConfig';
import { ref, set } from 'firebase/database';

const Stack = createStackNavigator();

const AccessScreen = ({ onVerified }) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const verifyKey = async () => {
    setLoading(true);
    if (key === 'myApp@2025') {
      await AsyncStorage.setItem('chat_key', key);
      await set(ref(db, 'accessKey'), key);
      onVerified();
    } else {
      alert('Invalid key');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Access Key</Text>
      <TextInput
        placeholder="Access Key"
        value={key}
        onChangeText={setKey}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Verify" onPress={verifyKey} disabled={loading} />
      {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </View>
  );
};

const App = () => {
  const [verified, setVerified] = useState(null); // null = loading, false = not verified, true = verified

  useEffect(() => {
    const checkKey = async () => {
      const storedKey = await AsyncStorage.getItem('chat_key');
      setVerified(storedKey === 'myApp@2025');
    };
    checkKey();
  }, []);

  if (verified === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!verified) {
    return <AccessScreen onVerified={() => setVerified(true)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Health">
        <Stack.Screen name="Health" component={HealthApp} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat with Friend' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
