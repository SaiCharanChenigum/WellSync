import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HealthApp = () => {
  const navigation = useNavigation();

  const [waterGlasses, setWaterGlasses] = useState(0);
  const [lastDate, setLastDate] = useState('');
  const [metrics, setMetrics] = useState({ steps: 0, kcal: 0, sleep: 0, active: 0 });

  useEffect(() => {
    const today = new Date().toDateString();
    AsyncStorage.getItem('health_data').then(data => {
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.date === today) {
          setWaterGlasses(parsed.water || 0);
          setMetrics(parsed.metrics);
        } else {
          resetDailyData(today);
        }
      } else {
        resetDailyData(today);
      }
    });
  }, []);

  const resetDailyData = async (today) => {
    const newMetrics = {
      steps: Math.floor(Math.random() * 3000 + 1000),
      kcal: Math.floor(Math.random() * 300 + 100),
      sleep: (Math.random() * 3 + 5).toFixed(1),
      active: Math.floor(Math.random() * 30 + 10),
    };
    setWaterGlasses(0);
    setMetrics(newMetrics);
    await AsyncStorage.setItem('health_data', JSON.stringify({ date: today, water: 0, metrics: newMetrics }));
  };

  const handleAddGlass = async () => {
    const newCount = waterGlasses + 1;
    setWaterGlasses(newCount);
    const today = new Date().toDateString();
    await AsyncStorage.mergeItem('health_data', JSON.stringify({ date: today, water: newCount }));
    animatePress(waterAnim);
  };

  const navigateToChat = () => navigation.navigate('Chat');
  const navigateToProfile = () => {
    animatePress(profileAnim);
    navigation.navigate('Profile');
  };

  const [stepsAnim] = useState(new Animated.Value(1));
  const [caloriesAnim] = useState(new Animated.Value(1));
  const [sleepAnim] = useState(new Animated.Value(1));
  const [activeAnim] = useState(new Animated.Value(1));
  const [waterAnim] = useState(new Animated.Value(1));
  const [homeAnim] = useState(new Animated.Value(1));
  const [profileAnim] = useState(new Animated.Value(1));

  const animatePress = (anim) => {
    Animated.spring(anim, {
      toValue: 0.95,
      friction: 5,
      tension: 20,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Health Journey</Text>
      </View>

      <View style={styles.overviewSection}>
        <Text style={styles.sectionTitle}>Today's Activity</Text>
        <View style={styles.metricsRow}>
          <TouchableOpacity style={[styles.metricCard, { transform: [{ scale: stepsAnim }] }]} onPress={() => animatePress(stepsAnim)}>
            <FontAwesome5 name="walking" size={24} color="#007bff" />
            <Text style={styles.metricValue}>{metrics.steps}</Text>
            <Text style={styles.metricUnit}>Steps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.metricCard, { transform: [{ scale: caloriesAnim }] }]} onLongPress={() => { animatePress(caloriesAnim); navigateToChat(); }} onPress={() => animatePress(caloriesAnim)}>
            <FontAwesome5 name="fire" size={24} color="#ffc107" />
            <Text style={styles.metricValue}>{metrics.kcal}</Text>
            <Text style={styles.metricUnit}>kcal</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.metricsRow}>
          <TouchableOpacity style={[styles.metricCard, { transform: [{ scale: sleepAnim }] }]} onPress={() => { animatePress(sleepAnim); Alert.alert('Sleep Tracking', 'View your sleep data here.'); }}>
            <FontAwesome5 name="moon" size={24} color="#6c757d" />
            <Text style={styles.metricValue}>{metrics.sleep}</Text>
            <Text style={styles.metricUnit}>Hours Sleep</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.metricCard, { transform: [{ scale: activeAnim }] }]} onPress={() => { animatePress(activeAnim); Alert.alert('Active Time', 'View your active time details.'); }}>
            <FontAwesome5 name="heartbeat" size={24} color="#dc3545" />
            <Text style={styles.metricValue}>{metrics.active}</Text>
            <Text style={styles.metricUnit}>Min Active</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.waterIntakeSection}>
        <Text style={styles.sectionTitle}>Water Intake</Text>
        <View style={styles.waterCounter}>
          <Text style={styles.waterValue}>{waterGlasses} Glasses</Text>
          <TouchableOpacity style={[styles.addGlassButton, { transform: [{ scale: waterAnim }] }]} onPress={handleAddGlass}>
            <FontAwesome5 name="plus-circle" size={30} color="#00aaff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={[styles.navItem, { transform: [{ scale: homeAnim }] }]} onPress={() => animatePress(homeAnim)}>
          <FontAwesome5 name="home" size={20} color="#555" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, { transform: [{ scale: profileAnim }] }]} onPress={navigateToProfile}>
          <FontAwesome5 name="user" size={20} color="#555" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingTop: 50, paddingHorizontal: 20, justifyContent: 'space-between' },
  header: { alignItems: 'center', marginBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#222' },
  overviewSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 15 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  metricCard: { backgroundColor: '#fff', borderRadius: 16, padding: 15, width: '45%', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  metricValue: { fontSize: 22, fontWeight: 'bold', color: '#444', marginTop: 5 },
  metricUnit: { fontSize: 14, color: '#777' },
  waterIntakeSection: { marginBottom: 30 },
  waterCounter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#e0f7fa', padding: 15, borderRadius: 16 },
  waterValue: { fontSize: 20, fontWeight: '500', color: '#00aaff' },
  addGlassButton: {},
  bottomNavigation: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#f9f9f9', paddingVertical: 25, borderTopWidth: 1, borderTopColor: '#f9f9f9' },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, color: '#555', marginTop: 5 },
});

export default HealthApp;
