import path from 'path'
import fs from 'fs'
import { useConfig } from './config.js'
import { loader, loaderJson, transformMapToObject, replaceModulePath } from '@violet-plus/utils'
import { compilerVueSFC2ESM } from './vue-compiler.js'
import { hasCache, setCacheFile, getCacheFile } from './cacheFile.js'

const { alias, extensions, violetRoot, extname, processJson } = await useConfig()
const contentType = loaderJson(path.join(violetRoot, './src/data/contentType.json'))

export default (options) => (req, res) => {
  /* 解析url */
  const url = req.url === '/' ? 'index.html' : req.url
  const [pathname, queryParams] = url.split('?')
  const query = transformMapToObject(new URLSearchParams(queryParams))

  /* 加载并返回文件 */
  try {
    if (hasCache(pathname)) {
      console.log(`[loader cache] ${pathname}`)
      const { content, ext } = getCacheFile(pathname)
      res.setHeader('Content-Type', contentType[ext] ?? contentType['.js'])
      res.end(content)
    } else {
      const { absolutePath, ext, filepath } = analysesAbsolutePath(pathname)
      console.log('[url] ', pathname)
      console.log('[loader] ', absolutePath)
      let content = loader(absolutePath)
      if (['.vue'].includes(ext)) {
        content = compilerVueSFC2ESM(content)
      }
      if ([...extname, '.vue'].includes(ext)) {
        content = replaceModulePath(content, alias, extname)
      }
      if (pathname === 'index.html') {
        content = prependScript(content, `window.process = ${processJson}`)
      }
      setCacheFile(filepath, pathname, content)
      res.setHeader('Content-Type', contentType[ext] ?? contentType['.js'])
      res.end(content)
    }

  } catch (e) {
    res.statusCode = 404
    res.end('404 Not Found')
    console.log('[error] ', e)
  }
}

/* 补全路径 */
const analysesAbsolutePath = (pathname) => {
  let root = process.cwd()
  const osRoot = root.slice(0, root.indexOf(path.sep) + 1)
  const isBareModule = pathname.indexOf('/node_modules/') === 0
  const extname = path.extname(pathname)

  do {
    if (!extname) {
      for (const ext of extensions) {
        const absolutePath = path.join(root, pathname) + ext
        if (fs.existsSync(absolutePath)) {
          return { absolutePath, ext, filepath: pathname + ext }
        }
      }
    } else {
      const absolutePath = path.join(root, pathname)
      if (fs.existsSync(absolutePath)) {
        return { absolutePath, ext: extname, filepath: pathname }
      }
    }

    root = path.join(root, '../')
  } while (osRoot !== root && isBareModule)

  return { absolutePath: pathname, ext: extname, filepath: pathname }
}

export const prependInBody = (html, content) => html.replace(/<body>/g, `<body>${content}`)

export const prependScriptBySrc = (html, url) => prependInBody(html, `<script src="${url}"></script>`)

export const prependScript = (html, content) => prependInBody(html, `<script>${content}</script>`)
