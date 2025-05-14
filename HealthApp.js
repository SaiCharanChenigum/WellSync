import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Easing } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HealthApp = () => {
  const navigation = useNavigation();
  const [waterGlasses, setWaterGlasses] = useState(0); // Start with 0 glasses
  const glassCapacityMl = 250;

  const navigateToChat = () => {
    navigation.navigate('Chat');
  };

  const handleAddGlass = () => {
    animatePress(waterAnim);
    setWaterGlasses(prevGlasses => prevGlasses + 1);
  };

  const navigateToProfile = () => {
    animatePress(profileAnim);
    navigation.navigate('Profile');
  };

  const [stepsAnim] = React.useState(new Animated.Value(1));
  const [caloriesAnim] = React.useState(new Animated.Value(1));
  const [sleepAnim] = React.useState(new Animated.Value(1));
  const [activeAnim] = React.useState(new Animated.Value(1));
  const [waterAnim] = React.useState(new Animated.Value(1));
  const [homeAnim] = React.useState(new Animated.Value(1));
  const [profileAnim] = React.useState(new Animated.Value(1));

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
    <View style={healthStyles.container}>
      <View style={healthStyles.header}>
        <Text style={healthStyles.headerTitle}>My Health Journey</Text>
      </View>

      <View style={healthStyles.overviewSection}>
        <Text style={healthStyles.sectionTitle}>Today's Activity</Text>
        <View style={healthStyles.metricsRow}>
          <TouchableOpacity
            style={[healthStyles.metricCard, { transform: [{ scale: stepsAnim }] }]}
            onPress={() => animatePress(stepsAnim)}
          >
            <FontAwesome5 name="walking" size={24} color="#007bff" />
            <Text style={healthStyles.metricValue}>1,856</Text>
            <Text style={healthStyles.metricUnit}>Steps</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[healthStyles.metricCard, { transform: [{ scale: caloriesAnim }] }]}
            onLongPress={() => {
              animatePress(caloriesAnim);
              navigateToChat();
            }}
            onPress={() => animatePress(caloriesAnim)}
          >
            <FontAwesome5 name="fire" size={24} color="#ffc107" />
            <Text style={healthStyles.metricValue}>420</Text>
            <Text style={healthStyles.metricUnit}>kcal</Text>
          </TouchableOpacity>
        </View>
        <View style={healthStyles.metricsRow}>
          <TouchableOpacity
            style={[healthStyles.metricCard, { transform: [{ scale: sleepAnim }] }]}
            onPress={() => {
              animatePress(sleepAnim);
              Alert.alert('Sleep Tracking', 'View your sleep data here.');
            }}
          >
            <FontAwesome5 name="moon" size={24} color="#6c757d" />
            <Text style={healthStyles.metricValue}>7.5</Text>
            <Text style={healthStyles.metricUnit}>Hours Sleep</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[healthStyles.metricCard, { transform: [{ scale: activeAnim }] }]}
            onPress={() => {
              animatePress(activeAnim);
              Alert.alert('Active Time', 'View your active time details.');
            }}
          >
            <FontAwesome5 name="heartbeat" size={24} color="#dc3545" />
            <Text style={healthStyles.metricValue}>30</Text>
            <Text style={healthStyles.metricUnit}>Min Active</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={healthStyles.waterIntakeSection}>
        <Text style={healthStyles.sectionTitle}>Water Intake</Text>
        <View style={healthStyles.waterCounter}>
          <Text style={healthStyles.waterValue}>{waterGlasses} Glasses</Text>
          <TouchableOpacity
            style={[healthStyles.addGlassButton, { transform: [{ scale: waterAnim }] }]}
            onPress={handleAddGlass}
          >
            <FontAwesome5 name="plus-circle" size={30} color="#00aaff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={healthStyles.bottomNavigation}>
        <TouchableOpacity
          style={[healthStyles.navItem, { transform: [{ scale: homeAnim }] }]}
          onPress={() => animatePress(homeAnim)}
        >
          <FontAwesome5 name="home" size={20} color="#555" />
          <Text style={healthStyles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[healthStyles.navItem, { transform: [{ scale: profileAnim }] }]}
          onPress={navigateToProfile}
        >
          <FontAwesome5 name="user" size={20} color="#555" />
          <Text style={healthStyles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const healthStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 50,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  overviewSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    width: '45%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 5,
  },
  metricUnit: {
    fontSize: 14,
    color: '#777',
  },
  waterIntakeSection: {
    marginBottom: 30,
  },
  waterCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e0f7fa',
    padding: 15,
    borderRadius: 16,
  },
  waterValue: {
    fontSize: 20,
    fontWeight: '500',
    color: '#00aaff',
  },
  addGlassButton: {},
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    paddingVertical: 25,
    borderTopWidth: 1,
    borderTopColor: '#f9f9f9',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },
});

export default HealthApp;
