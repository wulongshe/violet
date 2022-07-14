import { cac } from 'cac'
import { server } from './server.js'
import { useConfig, mergeConfig } from './config.js'

const root = process.cwd()
const config = await useConfig()

const cli = cac('violet')

// dev
cli
  .command('dev')
  .option('--mode [mode]')
  .action(async (options) => {
    mergeConfig(options)
    server(root, { ...config, ...options })
  })

cli.help()
cli.version(config.version)
cli.parse()
