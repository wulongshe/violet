import url from 'url'
import path from 'path'
import fs from 'fs'
import { loaderJson, existsSync } from './file.js'

export const parseModulePath = (fileUrl) => {
  const __filename = url.fileURLToPath(fileUrl);
  const __dirname = path.dirname(__filename);
  return { __filename, __dirname }
}

export const analysesBareModulePath = (modulePath, extname) => {
  let root = process.cwd()
  const osRoot = root.slice(0, root.indexOf(path.sep) + 1)

  while (osRoot !== root) {
    const bareModulePath = analysesBareModulePathWithRoot(root, modulePath)
    if (bareModulePath) {
      return bareModulePath
    }

    root = path.join(root, '../')
  }
}

export const analysesBareModulePathWithRoot = (root, modulePath, extname) => {
  /**
   * exists /node_modules/${modulePath}/
   *   ? exists package.json
   *     ? ({ module, main }, exists module)
   *       ? module
   *       : exists /node_modules/${modulePath}/esm/index[.js|.ts]
   *         ? /node_modules/${modulePath}/esm/index[.ts|.ts]
   *         : exists main ? main : null
   *     : exists index[.js|.ts] ? index[.js|.ts] : null
   *   : null
   */
  const moduleDir = path.join(root, 'node_modules', modulePath)
  const moduleDirPath = `/node_modules/${modulePath}`
  if (!fs.existsSync(moduleDir)) return null
  const packagePath = path.join(moduleDir, 'package.json')
  if (fs.existsSync(packagePath)) {
    const { module: esm, main } = loaderJson(packagePath)
    if (esm) return `${moduleDirPath}/${esm}`
    const esmPath = existsSync(path.join(moduleDir, 'esm/index'), extname)
    if (esmPath) return `${moduleDirPath}/esm/index${path.extname(indexPath)}`
    if (main) return `${moduleDirPath}/${main}`
  } else {
    const indexPath = existsSync(path.join(moduleDir, 'index'), extensions)
    if (indexPath) return `${moduleDirPath}/index${path.extname(indexPath)}`
  }
  return null
}
