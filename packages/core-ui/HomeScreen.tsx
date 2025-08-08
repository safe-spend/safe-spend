import { StyleSheet, Pressable, ScrollView, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { addName, getAllNames } from '@safe-spend/framework';
import { Name } from '@safe-spend/framework/src/db/types';

export const HomeScreen = () => {
  const [localCount, setLocalCount] = useState(0);
  const [names, setNames] = useState<Array<Name>>([]);

  useEffect(() => {
    try {
      const initialNames = getAllNames();
      setNames(initialNames || []);
    } catch (error) {
      console.error("Error loading names:", error);
      setNames([]);
    }
  }, []);

  const handleLocalButton = () => {
    setLocalCount(prev => prev + 1);
  };

  const handleDbButton = () => {
    try {
      // Add a random number as a name
      const randomName = Math.floor(Math.random() * 1000).toString();
      addName(randomName);
      // Update the names list safely
      try {
        const currentNames = getAllNames();
        setNames(currentNames || []);
      } catch (error) {
        console.error("Error refreshing names:", error);
      }
    } catch (error) {
      console.error("Error adding name:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.counterContainer}>
          <Text style={styles.text}>Local Count: {localCount}</Text>
          <Pressable style={styles.button} onPress={handleLocalButton}>
            <Text style={styles.buttonText}>Increment Local</Text>
          </Pressable>
        </View>

        <View style={styles.counterContainer}>
          <Text style={styles.text}>DB Names Count: {names.length}</Text>
          <Pressable style={styles.button} onPress={handleDbButton}>
            <Text style={styles.buttonText}>Add Random Name</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.namesContainer}>
        <Text style={styles.title}>Names List:</Text>
        <ScrollView style={styles.scrollView}>
          {names.map((nameObj) => (
            <View key={nameObj.id} style={styles.nameItem}>
              <Text style={styles.nameText}>{nameObj.name}</Text>
              <Text style={styles.dateText}>
                {new Date(nameObj.createdAt).toLocaleString()}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  topSection: {
    marginBottom: 20,
  },
  counterContainer: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    color: '#eee',
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  namesContainer: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 20,
    color: '#eee',
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  nameItem: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  nameText: {
    fontSize: 18,
    color: '#eee',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
});