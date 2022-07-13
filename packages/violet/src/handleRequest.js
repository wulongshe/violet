import path from 'path'
import fs from 'fs'
import { useConfig } from './config.js'
import { loader, loaderJson } from './file.js'
import { transformMapToObject, replaceModulePath } from './utils.js'

const { alias, extensions, violetRoot, extname } = await useConfig()
const contentType = loaderJson(path.join(violetRoot, './src/data/contentType.json'))

export default (options) => (req, res) => {
  /* 解析url */
  const url = req.url === '/' ? 'index.html' : req.url
  const [pathname, queryParams] = url.split('?')
  const query = transformMapToObject(new URLSearchParams(queryParams))
  const { absolutePath, ext } = analysesAbsolutePath(pathname)

  /* 加载并返回文件 */
  try {
    console.log(`[loader] ${pathname} => ${absolutePath}`)
    let content = loader(absolutePath)
    if (extname.includes(ext)) {
      content = replaceModulePath(content, alias, extname)
    }
    res.setHeader('Content-Type', contentType[ext] ?? contentType['.js'])
    res.end(content)
  } catch (e) {
    res.statusCode = 404
    res.end('404 Not Found')
    console.log('[error] ', e.message)
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
          return { absolutePath, ext }
        }
      }
    } else {
      const absolutePath = path.join(root, pathname)
      if (fs.existsSync(absolutePath)) {
        return { absolutePath, ext: extname }
      }
    }

    root = path.join(root, '../')
  } while (osRoot !== root && isBareModule)

  return { absolutePath: pathname, ext: extname }
}
