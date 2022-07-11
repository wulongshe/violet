export default ({ root, env }) => ({
  port: 8080,
  alias: {
    '@': '/src'
  },
  extensions: [
    '.js',
    '.mjs',
    '.css',
    '.html'
  ],
})

