# violet cli

## 简介

- 提供无需打包的开发环境快速启动

## 原理

- 基于浏览器原生 es module

## 使用

```bash
# 下载
yarn add @violet/violet
# 开发
yarn dev
```

## 配置

- 项目根目录下 配置 `violet.config[.js|.ts]`

```js
export default ({ root, env }) => ({
  port: 8080,
  alias: {
    "@": "/src",
  },
  extensions: [".js", ".mjs", ".css", ".html"],
});
```
