import { fileURLToPath, URL } from 'node:url'; // 导入Node.js的URL处理模块

import { defineConfig } from 'vite'; // 导入Vite的配置定义函数
import vue from '@vitejs/plugin-vue'; // 导入Vue插件，支持Vue单文件组件

/**
 * Vite项目配置文件
 * 配置参考：https://vitejs.dev/config/
 */
export default defineConfig({
  // 插件配置（增强Vite功能）
  plugins: [
    vue(), // 启用Vue 3单文件组件支持
  ],
  
  // 路径解析配置（处理模块导入路径）
  resolve: {
    alias: {
      // 配置别名 '@' 指向项目的src目录
      // 例如：import App from '@/App.vue' 等价于 import App from './src/App.vue'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  // 开发服务器配置（仅在开发环境生效）
  server: {
    // 配置代理服务器（解决跨域问题）
    proxy: {
      // 所有以/api开头的请求路径都会被代理
      '/api': {
        target: 'http://localhost:8080', // 目标服务器地址（后端API地址）
        secure: false, // 不验证SSL证书
        changeOrigin: true, // 修改请求头中的Origin字段为目标服务器地址
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径，去除/api前缀
        // 例如：/api/users => http://localhost:8080/users
      }
    }
  }
});