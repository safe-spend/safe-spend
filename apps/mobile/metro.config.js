const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

const coreUiPath = path.resolve(__dirname, '../../packages/core-ui');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    watchFolders: [coreUiPath],
    resolver: {
        blockList: exclusionList([
            // Prevent Metro from seeing duplicate modules
            new RegExp(`${path.resolve(coreUiPath, 'node_modules').replace(/[/\\]/g, '/')}.*`),
        ]),
        extraNodeModules: {
            'react': path.resolve(__dirname, 'node_modules/react'),
            'react-native': path.resolve(__dirname, 'node_modules/react-native'),
        }
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
