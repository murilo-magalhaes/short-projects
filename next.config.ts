import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.watchOptions = {
            poll: 1000,       // check for changes every second
            aggregateTimeout: 300,
        };
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/**', // Permite qualquer caminho dentro do github.com
            },
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
                port: '',
                pathname: '/**', // Permite qualquer caminho dentro do github.com
            },
        ],
    },
};

export default nextConfig;