module.exports = {
    presets: [
        // React Native preset with TypeScript support
        ['@react-native/babel-preset', {
            // Enable TypeScript support
            useTransformReactJSXExperimental: true,
        }],
    ],
    plugins: [
        // Support for absolute imports and module resolution
        [
            'module-resolver',
            {
                root: ['./'],
                alias: {
                    // Alias for shared packages
                    '@safe-spend/common': './packages/common/src',
                    '@safe-spend/ui': './packages/ui/src',
                    // App-specific aliases (can be overridden in app-specific configs)
                    '@': './src',
                    '@assets': './assets',
                    '@components': './src/components',
                    '@screens': './src/screens',
                    '@utils': './src/utils',
                    '@types': './src/types',
                },
                extensions: [
                    '.ios.js',
                    '.android.js',
                    '.native.js',
                    '.js',
                    '.ios.jsx',
                    '.android.jsx',
                    '.native.jsx',
                    '.jsx',
                    '.ios.ts',
                    '.android.ts',
                    '.native.ts',
                    '.ts',
                    '.ios.tsx',
                    '.android.tsx',
                    '.native.tsx',
                    '.tsx',
                    '.json',
                ],
            },
        ],
        // Support for optional chaining and nullish coalescing
        '@babel/plugin-transform-optional-chaining',
        '@babel/plugin-transform-nullish-coalescing-operator',
        // Support for React Native Reanimated (if used)
        'react-native-reanimated/plugin',
    ],
    env: {
        production: {
            plugins: [
                // Remove console logs in production
                'transform-remove-console',
            ],
        },
    },
};
