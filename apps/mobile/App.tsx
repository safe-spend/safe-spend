/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { HomeScreen } from '@safe-spend/core-ui';
import { registerPlatform } from '@safe-spend/framework';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { MobilePlatform } from './MobilePlatform';

registerPlatform(new MobilePlatform());

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <HomeScreen />
      {/* <NewAppScreen templateFileName="App.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
