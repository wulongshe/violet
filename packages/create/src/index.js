import path from 'path'
import fs from 'fs-extra'
import { analysesBareModuleDir, loaderJson, writeJson } from '@violet-plus/utils'

export const create = ({ root, projectName }) => {
  const templateModulePath = analysesBareModuleDir('@violet-plus/template')
  const projectPath = path.join(root, projectName)
  copyFile(templateModulePath, projectPath)
  replacePackageJson(projectPath, { name: projectName })
}

export const copyFile = (source, dist) => {
  if (fs.existsSync(dist)) {
    throw Error(`folder '${dist}' already exists.`)
  }
  fs.copySync(source, dist)
  console.log(`[copy] ${source} => ${dist}`)
}

export const replacePackageJson = (projectPath, { name, version }) => {
  const packagePath = path.join(projectPath, 'package.json')
  const __package__ = loaderJson(packagePath)

  __package__.name = name
  __package__.version = version ?? '0.0.0'

  writeJson(packagePath, __package__)
}
