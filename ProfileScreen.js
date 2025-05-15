import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const ProfileScreen = () => {
  const userDetails =
    Platform.OS === 'ios'
      ? {
          name: 'Sai Charan',
          age: 21,
          location: 'Hyderabad',
          weight: '64 kg',
          height: '178 cm', // 5'10"
          goal: 'Maintain fitness level',
        }
      : {
          name: 'Rithika',
          age: 18,
          location: 'Hyderabad',
          weight: '40 kg',
          height: '155 cm', // 5'1"
          goal: 'Weight gain',
        };

  return (
    <View style={profileStyles.container}>
      <View style={profileStyles.detailCard}>
        <Text style={profileStyles.title}>Profile Details</Text>
        <Text style={profileStyles.info}>Name: {userDetails.name}</Text>
        <Text style={profileStyles.info}>Age: {userDetails.age}</Text>
        <Text style={profileStyles.info}>Location: {userDetails.location}</Text>
        <Text style={profileStyles.info}>Weight: {userDetails.weight}</Text>
        <Text style={profileStyles.info}>Height: {userDetails.height}</Text>
        <Text style={profileStyles.info}>Goal: {userDetails.goal}</Text>
      </View>
    </View>
  );
};

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f7f6',
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
});

export default ProfileScreen;
