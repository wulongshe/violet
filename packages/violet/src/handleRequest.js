import path from 'path'
import fs from 'fs'
import { useConfig } from './config.js'
import { loader } from './file.js'
import { getExtension, transformMapToObject, replaceModulePath, trimWith } from './utils.js'

const root = process.cwd()
const { alias, extensions } = await useConfig()
const resolveAlias = Object.keys(alias).
  reduce((pre, curr) => (pre[trimWith(curr, '/')] = '/' + trimWith(alias[curr], '/'), pre), {})

const contentType = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.json': 'application/json',
  '.css': 'text/css',
}

export default (options) => (req, res) => {
  /* 解析url */
  const url = req.url === '/' ? 'index.html' : req.url
  let [pathname, queryParams] = url.split('?')
  let ext = getExtension(pathname)
  const query = transformMapToObject(new URLSearchParams(queryParams))
  const isBareModule = pathname.indexOf('/node_modules/') === 0

  /* 补全路径 */
  let rootPath = root
  let absolutePath = path.join(root, pathname)
  analysesAbsolutePath:
  do {
    if (!ext) {
      for (const suf of extensions) {
        absolutePath = path.join(rootPath, pathname) + suf
        if (fs.existsSync(absolutePath)) {
          pathname += suf
          ext = suf
          break analysesAbsolutePath
        }
      }
    } else {
      absolutePath = path.join(rootPath, pathname)
    }

    const temp = path.join(rootPath, '../')
    if (temp === rootPath) break analysesAbsolutePath
    rootPath = temp
  } while (!fs.existsSync(absolutePath) && isBareModule)

  /* 加载并返回文件 */
  try {
    console.log(`[loader] ${absolutePath}`)
    let content = loader(absolutePath)
    if (ext === '.js') {
      content = replaceModulePath(content, resolveAlias)
    }
    res.setHeader('Content-Type', contentType[ext])
    res.end(content)
  } catch (e) {
    res.statusCode = 404
    res.end('404 Not Found')
  }
}
