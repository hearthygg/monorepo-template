/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // 读取 .env 文件
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [vue(), tailwindcss()],
    test: {
      globals: true, // 允许在测试文件中直接使用 describe, it 等全局变量
      environment: 'jsdom' // 使用 jsdom 环境进行测试
      // setupFiles: './tests/setup.js', // 可选：设置测试前的初始化文件
    },
    base: env.VITE_BASE, // 设置公共路径
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT) || 3002,
      open: false, // 运行自动打开浏览器
      // 开发环境中代理配置
      proxy: {
        [env.VITE_GLOB_API_URL]: {
          target: 'http://10.10.10.124:3600', // 本地测试环境
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp('^' + env.VITE_GLOB_API_URL), env.VITE_GLOB_API_URL)
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
  };
});
