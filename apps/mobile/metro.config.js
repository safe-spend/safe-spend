const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

// Define paths relative to the mobile app
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

// Get the default Metro config for this directory (mobile app)
const defaultConfig = getDefaultConfig(projectRoot);

/**
 * Metro configuration for Safe Spend Mobile App (React Native)
 * Configured for monorepo workspace with proper module resolution from workspace root
 */
const config = {
    projectRoot,

    // Watch workspace for changes in shared packages
    watchFolders: [
        workspaceRoot,
        path.resolve(workspaceRoot, 'packages'),
    ],

    resolver: {
        // Support platform-specific extensions
        platforms: ['ios', 'android', 'native', 'web'],

        // Resolve modules from workspace node_modules ONLY
        nodeModulesPaths: [
            path.resolve(workspaceRoot, 'node_modules'),
        ],

        // Custom resolver for workspace packages
        resolverMainFields: ['react-native', 'browser', 'main'],

        // File extensions to resolve
        sourceExts: [
            'js',
            'jsx',
            'ts',
            'tsx',
            'json',
            'cjs',
            'mjs',
        ],

        // Asset extensions
        assetExts: [
            'png',
            'jpg',
            'jpeg',
            'gif',
            'svg',
            'webp',
            'mp4',
            'mov',
            'avi',
            'mp3',
            'wav',
            'aac',
            'pdf',
            'ttf',
            'otf',
            'woff',
            'woff2',
        ],

        // Disable hierarchical lookup to prevent looking in mobile/node_modules
        disableHierarchicalLookup: true,
    },

    transformer: {
        // Enable Babel transforms
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),

        // Support for TypeScript
        babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
    },

    // Maximum number of workers
    maxWorkers: 2,
};

module.exports = mergeConfig(defaultConfig, config);
