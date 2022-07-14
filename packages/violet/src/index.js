import { cac } from 'cac'
import { create } from '@violet-plus/create'
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

// create
cli
  .command('create [projectName]')
  .action(async (projectName, options) => {
    console.log('[projectName] ', projectName)
    create({ root, projectName, ...options })
  })

cli.help()
cli.version(config.version)
cli.parse()
