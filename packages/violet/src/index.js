import http from 'http'
import handleRequest from './handleRequest.js'
import { useConfig } from './config.js'

const root = process.cwd()
const { port, violetRoot } = await useConfig()

const app = http.createServer()

app.on('request', handleRequest())

app.listen(port, () => {
  console.log(`[root] ${root}`)
  console.log(`[violetRoot] ${violetRoot}`)
  console.log(`[localhost] http://127.0.0.1:${port}`)
})