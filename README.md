# violet cli

> 前端开发构建工具

## 简介

- 提供无需打包的开发环境快速启动

## 原理

- 基于浏览器原生 es module

## 使用

```bash
# 下载
yarn add @violet-plus/violet
# 安装依赖
yarn
# 启动开发环境
# package.json 中添加脚本 `{ "scripts" : { "violet dev" } }`
yarn dev
```

## 业务模板

> 参考 `https://gitee.com/yuki-0505/violet/tree/master/packages/template`

## 配置

- 项目根目录下 配置 `violet.config.js`

```js
export default ({ root, env }) => ({
  port: 8080,
  alias: {
    "@": "/src",
  },
  extensions: [".js", ".mjs", ".css", ".html"],
});
```

## 功能

- [x] 开发环境服务器
- [x] 按需编译
- [x] 文件缓存
- [ ] 监听文件修改
- [ ] 主动推送刷新
- [ ] 兼容 typescript
- [x] 读取配置文件
- [ ] loader
- [ ] plugin
- [ ] build
