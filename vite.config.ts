import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/monorepo-template/', // 设置公共路径
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false, // 运行自动打开浏览器
    // 开发环境中代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // 生产环境是否生成 source map 源码映射文件
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'] // 将 vue 单独打包成一个 chunk
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
