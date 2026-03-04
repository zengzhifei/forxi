# Vue CyberPanel Demo

这是一个使用 Vue 3 + Vite + Tailwind CSS 实现的创意 Demo 页面（纯前端，无后端依赖）。

## 功能特点
- **赛博朋克风格 (Cyberpunk)**: 具有霓虹效果、扫描线、以及科技感的 UI。
- **柔和主题背景**: 支持随时间自动切换主题色，并可手动切换。

## 项目结构
- `src/App.vue`: 主要页面逻辑和 UI 样式。
- `src/App.vue`: 主页面与主题切换控件。

## 如何部署 (Production)

项目已完成编译打包，产物位于 `dist` 目录中。

### 1. 静态文件部署
你可以将 `dist` 目录下的所有文件上传到任何静态文件服务器（如 Nginx, Apache, Vercel, GitHub Pages 等）。

### 2. Nginx 配置示例
纯前端静态部署下，仅需开启前端路由的回退：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. 快速预览打包产物
如果你想在本地快速预览打包后的效果，可以运行：
```bash
/opt/homebrew/bin/npm run preview
```
