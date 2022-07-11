export const getExtension = filename => {
  const idx = filename.lastIndexOf('.')
  return idx !== -1 ? filename.substring(idx) : null
}

export const transformMapToObject = (map) => [...map.entries()].reduce((obj, [key, value]) => (obj[key] = value, obj), {})


export const ensureStartWith = (str) => (prefixList) => {
  if (!Array.isArray(prefixList)) {
    prefixList = [prefixList]
  }

  for (let i = 0; i < prefixList.length; i++) {
    if (str.indexOf(prefixList[i]) !== -1) {
      return i
    }
  }

  return -1
}

export const trimWith = (str, ch) => str.replace(new RegExp(`^${ch}+|${ch}+$`, 'g'), '')

export const transformModulePath = (modulePath, alias) => {
  const aliasKeys = Object.keys(alias)
  const moduleEnsureStartWith = ensureStartWith(modulePath)

  let index = -1

  if ((index = moduleEnsureStartWith(['./', '../'])) !== -1) {
    return modulePath
  } else if ((index = moduleEnsureStartWith(aliasKeys)) !== -1) {
    const key = aliasKeys[index]
    return modulePath.replace(key, alias[key])
  }
  // TODO: 裸模块 bare module
  return `/node_modules/${modulePath}/esm/index.js`
}

export const replaceModulePath = (content, alias) => {
  return content.replace(/(import.*)'(.*)'/g, (_, $1, $2) => {
    const resolvePath = transformModulePath($2, alias)
    console.log(`[replace] ${$2} => ${resolvePath}`)
    return `${$1}'${resolvePath}'`
  })
}
