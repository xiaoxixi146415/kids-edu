import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// base 设为相对路径：EdgeOne Pages 部署在子路径/预览域名下也能正确加载资源
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      // 内置 Apple 补丁：iOS 添加到主屏时自动读取 apple-touch-icon
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: '宝宝乐园',
        short_name: '宝宝乐园',
        description: '专为幼儿设计的有声教育乐园：知识百科、脑筋急转弯、唐诗、识字、数学、动物、绘本、拼音，点一点就会朗读。',
        theme_color: '#bde4ff',
        background_color: '#e8f7ff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        lang: 'zh-CN',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // hash 路由全站单页，预缓存产物 + 导航兜底即可完全离线
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // 预缓存的资源使用 stale-while-revalidate，自动更新
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  base: './',
  build: {
    rollupOptions: {
      output: {
        // 把 vue 运行时拆成独立 vendor chunk，长缓存友好
        manualChunks: {
          vendor: ['vue', 'vue-router'],
        },
      },
    },
  },
})
