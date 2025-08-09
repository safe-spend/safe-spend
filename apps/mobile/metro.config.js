const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

const coreUiPath = path.resolve(__dirname, '../../packages/core-ui');
const frameworkPath = path.resolve(__dirname, '../../packages/framework');

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
            new RegExp(`${path.resolve(coreUiPath, 'node_modules').replace(/[/\\]/g, '/')}.*`),
        ]),
        nodeModulesPaths: [
            path.resolve(__dirname, 'node_modules'),
        ],
        extraNodeModules: {
            'react': path.resolve(__dirname, 'node_modules/react'),
            'react-native': path.resolve(__dirname, 'node_modules/react-native'),
            '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
        }
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
