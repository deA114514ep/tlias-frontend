# Tlias Web Management System - 前端项目

## 项目简介

这是一个基于Vue.js的员工管理系统前端项目，提供现代化的用户界面，支持员工信息的增删改查、登录认证、密码修改等功能。

## 技术栈

- **框架**: Vue.js 3.x
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **CSS预处理器**: SCSS
- **Node版本**: Node.js 16+

## 项目结构

```
tlias-frontend/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API接口
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── styles/            # 样式文件
│   ├── utils/             # 工具函数
│   └── views/             # 页面组件
├── package.json           # 项目配置
└── vite.config.js         # Vite配置
```

## 主要功能

- ✅ 用户登录/登出
- ✅ 员工信息管理（增删改查）
- ✅ 分页查询
- ✅ 条件查询
- ✅ 密码修改
- ✅ 文件上传
- ✅ 数据统计图表
- ✅ 响应式设计
- ✅ 权限控制

## 快速开始

### 环境要求

- Node.js 16+
- npm 8+ 或 yarn 1.22+

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/deA114514ep/tlias-frontend.git
   cd tlias-frontend
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **配置后端接口**
   - 编辑 `src/api/request.js`
   - 修改 `baseURL` 为后端服务地址

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

5. **构建生产版本**
   ```bash
   npm run build
   # 或
   yarn build
   ```

### 开发说明

- 开发服务器默认运行在 http://localhost:5173
- 支持热重载
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化

### 默认账户

- 用户名: admin
- 密码: 123456

## 页面说明

- **登录页**: 用户登录认证
- **首页**: 数据统计和概览
- **员工管理**: 员工信息的增删改查
- **部门管理**: 部门信息管理
- **班级管理**: 班级信息管理
- **学生管理**: 学生信息管理
- **个人中心**: 个人信息和密码修改

## 注意事项

- 确保后端服务已启动
- 确保后端服务运行在 http://localhost:8080
- 首次运行需要先启动后端服务

## 贡献

欢迎提交Issue和Pull Request来改进项目。

## 许可证

MIT License
