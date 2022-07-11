import path from 'path'
import { parseModulePath } from './path.js'
import { loaderJsonAsync, existsSync, removeFile } from './file.js'
import { build } from 'esbuild'

const root = process.cwd()
const { __dirname } = parseModulePath(import.meta.url)

const parseVioletRoot = () => ({ violetRoot: path.join(__dirname, '../') })

const parsePackageJson = async () => ({
  ...await loaderJsonAsync(path.join(root, 'package.json'))
})

const parseUserConfig = async () => {
  const outFile = '../.violet/violet.config.js'
  const violetConfigName = 'violet.config'
  const extensions = ['.js', '.ts']
  const configFile = existsSync(path.join(root, violetConfigName), extensions)

  if (!configFile) return {}

  await build({
    entryPoints: [configFile],
    format: 'esm',
    outfile: path.join(__dirname, outFile),
    platform: 'node',
    bundle: true,
  })

  const userConfig = await import(outFile)
  removeFile(path.join(__dirname, outFile))
  return userConfig.default({ root, env: import.meta.env })
}

const defaultConfig = {
  port: 3000,
}
const resolveConfig = new Promise((resolve, reject) => Promise
  .all([parseVioletRoot(), parsePackageJson(), parseUserConfig()])
  .then((configs) => resolve(mergeConfig(configs)))
  .catch(reject)
)

export const mergeConfig = (configs) => {
  configs = Array.isArray(configs) ? configs : [configs]
  return configs.reduce(Object.assign, defaultConfig)
}

export const useConfig = () => resolveConfig
