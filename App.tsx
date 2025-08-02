/**
 * Safe Spend React Native App for Windows
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  useColorScheme,
  Platform,
} from 'react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f5f5f5',
    flex: 1,
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#000'}]}>
          Welcome to Safe Spend! 💰
        </Text>
        <Text style={[styles.subtitle, {color: isDarkMode ? '#ccc' : '#666'}]}>
          Your personal finance companion
        </Text>
        <View style={styles.platformInfo}>
          <Text style={[styles.platformText, {color: isDarkMode ? '#4CAF50' : '#2E7D32'}]}>
            Running on: {Platform.OS}
          </Text>
          {Platform.OS === 'windows' && (
            <Text style={[styles.windowsText, {color: isDarkMode ? '#64B5F6' : '#1976D2'}]}>
              🎉 Windows App Ready!
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  platformInfo: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  platformText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  windowsText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;
