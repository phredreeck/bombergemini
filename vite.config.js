/* vite.config.js
 * 
 * Fichier de configuration pour la version web de l'application.
 */
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    base: "/gemini/",
    define: {
        "APP_MODE": JSON.stringify(process.env.NODE_ENV),
        "APP_PLATFORM": JSON.stringify("webapp"),
    },
    build: {
        assetsInlineLimit: 65536
    },
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                id: "ovh.feret.bombergemini",
                name: 'Bomber Gemini',
                short_name: 'Bomber Gemini',
                description: 'An arcade game inspired by Bomberman, Bubble Bobble and Boulder Dash.',
                categories: ["games"],
                theme_color: '#00FF00',
                background_color: '#00FF00',
                display: 'standalone',
                orientation: "landscape",
                lang: "en",
                icons: [
                    {
                        src: 'icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: 'icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    },
                    {
                        src: 'icon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: 'icon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'maskable'
                    },
                ]
            }
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@assets": fileURLToPath(new URL("./assets", import.meta.url)),
        }
    }
})
