import { analysesBareModulePath } from './path.js'

export const getExtension = filename => {
  const idx = filename.lastIndexOf('.')
  return idx !== -1 ? filename.substring(idx) : null
}

export const transformMapToObject = (map) =>
  [...map.entries()].reduce((obj, [key, value]) => (obj[key] = value, obj), {})

export const ensureStartWith = (str) => (prefixList) => {
  prefixList = Array.isArray(prefixList) ? prefixList : [prefixList]

  for (let i = 0; i < prefixList.length; i++) {
    if (str.indexOf(prefixList[i]) === 0) {
      return i
    }
  }

  return -1
}

export const trimWith = (str, ch) => str.replace(new RegExp(`^${ch}+|${ch}+$`, 'g'), '')

export const transformModulePath = (modulePath, alias, extname) => {
  const aliasKeys = Object.keys(alias)
  const moduleEnsureStartWith = ensureStartWith(modulePath)

  let index = -1

  if ((index = moduleEnsureStartWith(['.', './', '../'])) === 0) {
    return modulePath
  } else if ((index = moduleEnsureStartWith(aliasKeys)) === 0) {
    const key = aliasKeys[index]
    return modulePath.replace(key, alias[key])
  }
  // TODO: 裸模块 bare module
  return analysesBareModulePath(modulePath, extname)
}

export const replaceModulePath = (content, alias, extname) => content.replace(
  /(import.*|export.*from\s+)['"](.*)['"]/g,
  (_, $1, $2) => `${$1}'${transformModulePath($2, alias, extname)}'`
)
