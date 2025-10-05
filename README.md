# NeteaseModInjector - 组件管理网站

## 项目简介

NeteaseModInjector 是一款专为网易 Minecraft 模组注入器设计的组件管理网站，提供便捷的模组组件浏览、下载和管理功能。

## 功能特性

### 🔍 组件浏览
- 实时显示所有可用组件
- 支持组件搜索和筛选
- 展示组件详细信息（作者、版本、描述）

### 📥 组件下载
- 一键下载组件文件（.COP 格式）
- 支持多版本分支选择
- 安全的文件下载机制

### 💾 本地管理
- 记录已安装组件状态
- 本地存储组件信息
- 同步最后更新时间

### 🔄 组件同步
- 手动同步远程组件列表
- 显示最后同步时间
- 实时更新组件信息

## 技术栈

- **前端框架**: 原生 JavaScript (ES6+)
- **构建工具**: Webpack 5
- **HTTP 客户端**: Axios
- **本地存储**: LocalForage (IndexedDB)
- **样式**: CSS3 + Flexbox/Grid
- **部署**: GitHub Pages

## 项目结构

```
netease-mod-injector/
├── config/                 # Webpack 配置
├── public/                 # 静态资源
│   ├── components/         # 组件数据
│   │   ├── components-index.json    # 组件索引
│   │   └── [组件名]/               # 各组件文件夹
│   │       ├── meta.json            # 组件元信息
│   │       ├── README.md            # 组件说明
│   │       └── *.COP                # 组件文件
│   └── favicon.ico
├── scripts/                # 构建脚本
├── src/                    # 源代码
│   ├── api/                # API 接口
│   │   ├── componentApi.js # 组件相关 API
│   │   └── request.js      # HTTP 请求封装
│   ├── components/         # 组件模块
│   │   ├── component-manager.html   # 组件管理界面
│   │   ├── component-manager.js     # 组件管理逻辑
│   │   └── component-manager.css    # 组件管理样式
│   ├── styles/             # 全局样式
│   ├── utils/              # 工具函数
│   │   └── storage.js      # 本地存储工具
│   ├── index.html          # 主页面
│   └── main.js             # 应用入口
├── package.json            # 项目配置
└── README.md               # 项目说明
```

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:3000` 查看开发版本。

### 生产构建

```bash
npm run build
```

### 部署到 GitHub Pages

```bash
npm run deploy
```

## 组件管理

### 添加新组件

1. 在 `public/components/` 下创建组件文件夹
2. 添加 `meta.json` 文件定义组件信息
3. 添加 `README.md` 文件描述组件
4. 放置 `.COP` 组件文件
5. 更新 `components-index.json` 索引文件

### 组件元信息格式

```json
{
  "author": "组件作者",
  "version": "1.0.0-1.20",
  "displayName": "组件显示名称",
  "copNames": ["组件文件名.COP"],
  "description": "组件描述"
}
```

## 开发指南

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 ES6+ 语法规范
- 使用语义化命名

### 运行测试

```bash
npm run lint
```

### 组件 API

#### 获取组件列表
```javascript
import { getComponentFolders } from './api/componentApi';
const folders = await getComponentFolders();
```

#### 获取组件详情
```javascript
import { getComponentMeta, getComponentReadme } from './api/componentApi';
const meta = await getComponentMeta('组件文件夹名');
const readme = await getComponentReadme('组件文件夹名');
```

#### 下载组件
```javascript
import { getCopFileUrl } from './api/componentApi';
const downloadUrl = getCopFileUrl('组件文件夹名', '组件文件名.COP');
```

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 GPL-2.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系我们

- 项目主页: https://github.com/slfftz2011/mod-injector
- 问题反馈: https://github.com/slfftz2011/mod-injector/issues
- 邮箱: slfftz520@163.com

## 更新日志

### v1.0.0 (2025-10-05)
- ✨ 初始版本发布
- 🔍 实现组件浏览功能
- 📥 实现组件下载功能
- 💾 实现本地组件管理
- 🔄 实现组件同步功能

---

## 免责声明
本站和本工具是鉴于网易原生资源匮乏，搬运资源不完整或需付费的糟糕生态而衍生出的解决方案

作者本人仅起到源代码编写与维护作用，全体用户将也仅将使用和上传资源

我们 **不存在商业用途** 也 **没有动谁的蛋糕** ，仅用作娱乐用途

因以上原因导致的损失，本人 **不承担相应后果**

其余说明请见 [LICENSE](LICENSE)

特此声明

声明人：[slfftz520](https://github.com/slfftz2011)
声明时间: 2025/10/05 12:00