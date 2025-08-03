const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

// Get the default Metro config
const defaultConfig = getDefaultConfig(__dirname);

// Define the project root (monorepo root)
const projectRoot = __dirname;

// Define workspace root (same as project root in this case)
const workspaceRoot = projectRoot;

/**
 * Metro configuration for Safe Spend monorepo
 * This config enables:
 * - Workspace support for monorepo packages
 * - TypeScript support
 * - Platform-specific extensions
 * - Shared package resolution
 */
const config = {
    projectRoot,
    watchFolders: [
        // Watch the entire workspace for changes
        workspaceRoot,
        // Specifically watch packages
        path.resolve(workspaceRoot, 'packages'),
    ],

    resolver: {
        // Support platform-specific extensions
        platforms: ['ios', 'android', 'native', 'web'],

        // Resolve modules from workspace packages
        nodeModulesPaths: [
            path.resolve(projectRoot, 'node_modules'),
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

        // Disable automatic module resolution for workspace packages
        disableHierarchicalLookup: false,
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

    // Server configuration
    server: {
        port: 8081,
        enhanceMiddleware: (middleware) => {
            return (req, res, next) => {
                // Add CORS headers for development
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

                if (req.method === 'OPTIONS') {
                    res.sendStatus(200);
                } else {
                    middleware(req, res, next);
                }
            };
        },
    },

    // Serializer configuration for better bundle optimization
    serializer: {
        // Custom module ID factory for better debugging
        createModuleIdFactory: () => (path) => {
            // Use relative path as module ID for better debugging
            return path.replace(workspaceRoot, '').replace(/\\/g, '/');
        },
    },

    // Reset cache configuration
    resetCache: false,

    // Maximum number of workers
    maxWorkers: 2,
};

module.exports = mergeConfig(defaultConfig, config);
