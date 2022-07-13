import { parse, compileScript, compileTemplate, rewriteDefault } from '@vue/compiler-sfc'

export const compilerVueSFC2ESM = (file) => {
  const { descriptor, error } = parse(file)

  // 这个 id 是 scopeId，用于 css scope，保证唯一即可
  const id = Date.now().toString()
  const scopeId = `data-v-${id}`

  // 编译 script，因为可能有 script setup，还要进行 css 变量注入
  const script = compileScript(descriptor, { id: scopeId })

  // 用于存放代码，最后 join('\n') 合并成一份完整代码
  const codeList = []

  // 重写 default
  codeList.push(rewriteDefault(script.content, '__sfc_main__'))
  codeList.push(`__sfc_main__.__scopeId='${scopeId}'`)

  // 编译模板，转换成 render 函数
  const template = compileTemplate({
    source: descriptor.template.content,
    filename: 'main.vue', // 用于错误提示
    id: scopeId,
  })

  codeList.push(template.code)
  codeList.push(`__sfc_main__.render=render`)
  codeList.push(`export default __sfc_main__`)

  return codeList.join('\n')
}
