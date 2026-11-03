/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The app is served under /net-core-app/web/ by the ASP.NET Core host.
export default defineConfig({
    base: '/net-core-app/web/',
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '^/net-core-app/(?!web/)': {
                target: 'http://127.0.0.1:5050',
                changeOrigin: false,
            },
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
    },
    test: {
        environment: 'jsdom',
        include: ['src/**/*.test.ts'],
    },
});
