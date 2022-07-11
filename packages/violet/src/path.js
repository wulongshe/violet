import url from 'url'
import path from 'path'

export const parseModulePath = (fileUrl) => {
  const __filename = url.fileURLToPath(fileUrl);
  const __dirname = path.dirname(__filename);
  return { __filename, __dirname }
}
