import fs from 'fs'

export const loader = (pathname) => fs.readFileSync(pathname, 'utf-8')

export const loaderAsync = (pathname) => new Promise((resolve, reject) => fs.readFile(pathname, 'utf-8', (err, data) => {
  if (err) reject(err)
  else resolve(data)
}))

export const loaderJson = (pathname) => JSON.parse(loader(pathname))

export const loaderJsonAsync = async (pathname) => JSON.parse(await loaderAsync(pathname))

export const existsSyncWithExtensions = (filePath, extensions) => {
  for (const ext of extensions) {
    const fullFilePath = filePath + ext
    if (fs.existsSync(fullFilePath)) {
      return fullFilePath
    }
  }
}

export const removeFile = (filepath) => {
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
  }
}

export const writeJson = (path, data) => fs.writeFileSync(path, JSON.stringify(data), 'utf-8')
