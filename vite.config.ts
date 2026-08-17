import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base 设为相对路径：EdgeOne Pages 部署在子路径/预览域名下也能正确加载资源
export default defineConfig({
  plugins: [vue()],
  base: './',
})
