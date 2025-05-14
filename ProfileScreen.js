import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  // Replace with your actual details
  const userDetails = {
    name: 'Your Name',
    age: 30,
    location: 'Your City',
    // Add more details as needed
    weight: '70 kg',
    height: '175 cm',
    goal: 'Maintain fitness level',
  };

  return (
    <View style={profileStyles.container}>
      <View style={profileStyles.detailCard}>
        <Text style={profileStyles.title}>Details:</Text>
        <Text style={profileStyles.info}>Name: {userDetails.name}</Text>
        <Text style={profileStyles.info}>Age: {userDetails.age}</Text>
        <Text style={profileStyles.info}>Location: {userDetails.location}</Text>
        <Text style={profileStyles.info}>Weight: {userDetails.weight}</Text>
        <Text style={profileStyles.info}>Height: {userDetails.height}</Text>
        <Text style={profileStyles.info}>Goal: {userDetails.goal}</Text>
        {/* Add more of your details here */}
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
    color: '#555',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#777',
    marginBottom: 5,
  },
});

export default ProfileScreen; 