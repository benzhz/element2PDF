import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 打包输出目录
    outDir: 'extension',
    // 自定义底层的 Rollup 打包配置
    rollupOptions: {
      input: {
        content: path.resolve(__dirname, 'src/content.jsx'),
        popup: path.resolve(__dirname, 'popup.html'),
        options: path.resolve(__dirname, 'options.html')

      },
      output: {
        // 手动配置 chunks 的命名规则
        chunkFileNames: 'static/js/[name].js',
        entryFileNames: 'static/js/[name].js',
        assetFileNames: 'static/[ext]/[name].[ext]'
      }
    }
  }
})