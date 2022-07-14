import path from 'path'
import { parseModulePath, loaderJsonAsync, existsSyncWithExtensions, removeFile, trimWith } from '@violet-plus/utils'
import { build } from 'esbuild'

export const defaultConfig = {
  port: 3000,
  alias: {
    '@': '/src'
  },
  extensions: ['.js', '.mjs', '.css', '.html', '.json'],
  extname: ['.js', '.ts', '.mjs', '.cjs'],
  constants: {
    'process.env.NODE_ENV': process.env.NODE_ENV
  },
  processJson: JSON.stringify(process)
}

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
  const configFile = existsSyncWithExtensions(path.join(root, violetConfigName), extensions)

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

const formatConfig = (config) => ({
  ...config,
  alias: formatAlias(config.alias)
})

const formatAlias = (alias) => Object.keys(alias).reduce((pre, curr) =>
  (pre[trimWith(curr, '/') + '/'] = '/' + trimWith(alias[curr] + '/', '/'), pre), {})

const resolveConfig = new Promise((resolve, reject) => Promise
  .all([parseVioletRoot(), parsePackageJson(), parseUserConfig()])
  .then((configs) => resolve(formatConfig(mergeConfig(configs))))
  .catch(reject)
)

export const mergeConfig = (configs) => {
  configs = Array.isArray(configs) ? configs : [configs]
  return configs.reduce(Object.assign, defaultConfig)
}

export const useConfig = () => resolveConfig
