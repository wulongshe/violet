import fs from 'fs'
import path from 'path'
import { mkdirSync } from '@violet-plus/utils'
import { CycleMap } from '@violet-plus/class'

const cacheFolder = path.join(process.cwd(), '.violet')
// const filePathCacheMap = new Map()
// const pathNameCacheMap = new Map()
const cacheMap = new CycleMap()


export const setCacheFile = (filepath, pathname, content) => {
  const cacheFile = path.join(cacheFolder, filepath)
  const dirname = path.dirname(cacheFile)
  if (!fs.existsSync(dirname)) mkdirSync(dirname)
  fs.writeFileSync(cacheFile, content)
  // pathNameCacheMap.set(pathname, filepath)
  // filePathCacheMap.set(filepath, pathname)
  cacheMap.set(filepath, pathname)
}

export const getCacheFile = (pathname) => {
  const filename = cacheMap.get(pathname, false)
  return {
    content: fs.readFileSync(path.join(cacheFolder, filename)),
    // ext: path.extname(pathNameCacheMap.get(pathname))
    ext: path.extname(filename)
  }
}

export const deleteCacheFile = (filepath) => {
  cacheMap.delete(filepath)
  // const filename = filePathCacheMap.get(filepath)
  // pathNameCacheMap.delete(filename)
  // filePathCacheMap.delete(filepath)
}

// export const hasCache = (pathname) => pathNameCacheMap.has(pathname)
export const hasCache = (pathname) => cacheMap.has(pathname, false)
