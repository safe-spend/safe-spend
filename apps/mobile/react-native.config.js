const path = require('path');

// Define paths relative to the mobile app
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

module.exports = {
  // Tell React Native CLI where to find the react-native module
  reactNativePath: path.resolve(workspaceRoot, 'node_modules', 'react-native'),
  
  // Dependencies configuration for linking
  dependencies: {
    // Ensure all dependencies are resolved from workspace root
  },
};
