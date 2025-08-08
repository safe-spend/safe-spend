const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const fs = require('fs');
const path = require('path');

const rnwPath = fs.realpathSync(
  path.resolve(require.resolve('react-native-windows/package.json'), '..'),
);

const coreUiPath = path.resolve(__dirname, '../../../packages/core-ui');
const frameworkPath = path.resolve(__dirname, '../../../packages/framework');


/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [coreUiPath, frameworkPath],
  resolver: {
    blockList: exclusionList([
      // This stops "npx @react-native-community/cli run-windows" from causing the metro server to crash if its already running
      new RegExp(
        `${path.resolve(__dirname, 'windows').replace(/[/\\]/g, '/')}.*`,
      ),
      // This prevents "npx @react-native-community/cli run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip or other files produced by msbuild
      new RegExp(`${rnwPath}/build/.*`),
      new RegExp(`${rnwPath}/target/.*`),
      /.*\.ProjectImports\.zip/,
      // Prevent Metro from seeing duplicate modules
      new RegExp(`${path.resolve(coreUiPath, 'node_modules').replace(/[/\\]/g, '/')}.*`),
      new RegExp(`${path.resolve(frameworkPath, 'node_modules').replace(/[/\\]/g, '/')}.*`),
    ]),
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
    ]
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
