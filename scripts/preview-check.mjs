// scripts/preview-check.mjs
//
// 无人值守可用性检查(供 /perfect-version 等技能调用):
//   npm run build 之后,启动 vite preview + headless Chrome(CDP),
//   打开页面校验「渲染内容 + Service Worker + 控制台零错误」。
//
// 用法(在项目根目录执行):
//   node scripts/preview-check.mjs                    # 首页冒烟:至少渲染 1 张 .big-card
//   node scripts/preview-check.mjs pinyin "声母"       # 指定路由(不带 #/)+ 页面必须包含的文案
//
// 全部通过 → 退出码 0 并逐项打印 ✓;任一失败 → 非 0 退出码并打印 ✗。
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
// 每次运行用随机端口,避免与残留进程冲突(也不会误检到旧构建的 preview)
const PREVIEW_PORT = 4600 + Math.floor(Math.random() * 400)
const CDP_PORT = 9100 + Math.floor(Math.random() * 300)
// 路由名(不带 #/),如 'pinyin';不写则检查首页。
// 注意:不要传 '#/pinyin' 或 '/pinyin'——Git Bash 的 MSYS 会把带 / 的参数转写成
// Windows 路径(如 #C:/Program Files/Git/pinyin)。这里统一容错为纯路由名。
let TARGET = (process.argv[2] || '').replace(/^[#/\s]+/, '').trim()
const EXPECT = process.argv[3] || '' // 该路由页面必须包含的文案
const TARGET_URL = TARGET ? `#/${TARGET}` : ''
// 统一用 127.0.0.1:Windows 上 localhost 会优先解析到 IPv6 ::1,
// 而 Chrome DevTools 只监听 IPv4 127.0.0.1,连 ::1 会 ECONNREFUSED
const HOST = '127.0.0.1'
const BASE = `http://${HOST}:${PREVIEW_PORT}/${TARGET_URL}`

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function findChrome() {
  const candidates = [
    process.env.CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ].filter(Boolean)
  return candidates.find((p) => existsSync(p))
}

async function main() {
  const fail = (msg) => {
    console.error(`✗ ${msg}`)
    process.exit(1)
  }

  if (!existsSync(path.join(ROOT, 'dist', 'index.html'))) {
    fail('dist/index.html 不存在,请先 npm run build')
  }
  const chromePath = findChrome()
  if (!chromePath) fail('找不到 Chrome/Edge(可设置 CHROME 环境变量指向浏览器)')

  // 1. 启动 vite preview(用本地 node_modules/vite,不依赖 npx/全局)
  const viteBin = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
  const preview = spawn(process.execPath, [viteBin, 'preview', '--port', String(PREVIEW_PORT), '--host', HOST, '--strictPort'], { stdio: 'ignore' })

  let previewOk = false
  for (let i = 0; i < 40; i++) {
    await sleep(250)
    try {
      const r = await fetch(BASE)
      if (r.ok) { previewOk = true; break }
    } catch {}
  }
  if (!previewOk) {
    preview.kill()
    fail('vite preview 未就绪')
  }

  // 2. 启动 headless Chrome,指向待检查页面
  const profile = mkdtempSync(path.join(tmpdir(), 'kids-edu-check-'))
  const chrome = spawn(chromePath, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${profile}`,
    BASE,
  ], { stdio: 'ignore' })

  try {
    // 3. 连接 CDP
    let page = null
    for (let i = 0; i < 40; i++) {
      await sleep(250)
      try {
        const targets = await (await fetch(`http://${HOST}:${CDP_PORT}/json`)).json()
        page = targets.find((t) => t.type === 'page')
        if (page) break
      } catch {}
    }
    if (!page) fail('无法连接 CDP')

    const ws = new WebSocket(page.webSocketDebuggerUrl)
    let msgId = 0
    const pending = new Map()
    const errors = []

    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id)
        pending.delete(msg.id)
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)
      } else if (msg.method === 'Runtime.exceptionThrown') {
        errors.push(msg.params.exceptionDetails?.text || 'exception')
      } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        errors.push(msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '))
      } else if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        errors.push(msg.params.entry.text)
      }
    }
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })

    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++msgId
      pending.set(id, { resolve, reject })
      ws.send(JSON.stringify({ id, method, params }))
    })
    const evaluate = async (expression) => {
      const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
      return r?.result?.value
    }
    const waitFor = async (expr, ms = 15000) => {
      const deadline = Date.now() + ms
      while (Date.now() < deadline) {
        if (await evaluate(`!!(${expr})`)) return true
        await sleep(300)
      }
      return false
    }
    await send('Runtime.enable')
    await send('Log.enable')
    await send('Page.enable')

    // 4. 校验(先等页面内容稳定再读 title,避免拿到加载中的空文档)
    const checks = {}
    if (TARGET && EXPECT) {
      checks.mainRendered = await waitFor(`document.body && document.body.innerText.includes(${JSON.stringify(EXPECT)})`)
    } else {
      checks.mainRendered = await waitFor(`document.querySelectorAll('.big-card').length > 0`)
    }
    checks.title = await evaluate(`document.title`)
    checks.cardCount = await evaluate(`document.querySelectorAll('.big-card').length`)
    checks.swRegistered = await evaluate(`(async () => { try { const reg = await navigator.serviceWorker?.getRegistration(); return !!reg } catch { return false } })()`)
    checks.consoleErrors = errors.length

    console.log(`page url: ${page.url}`)
    let ok = true
    if (TARGET && EXPECT) {
      console.log(`${checks.mainRendered ? '✓' : '✗'} 路由 ${TARGET} 渲染了「${EXPECT}」`)
      ok = ok && checks.mainRendered
    } else {
      console.log(`${checks.title ? '✓' : '✗'} title: ${JSON.stringify(checks.title)}`)
      console.log(`${checks.mainRendered ? '✓' : '✗'} 首页 .big-card 已渲染`)
      console.log(`${checks.cardCount ? '✓' : '✗'} .big-card 数量: ${checks.cardCount}`)
      ok = ok && checks.mainRendered && !!checks.title
    }
    console.log(`${checks.swRegistered ? '✓' : '✗'} Service Worker 已注册`)
    console.log(`${checks.consoleErrors === 0 ? '✓' : '✗'} 控制台错误: ${checks.consoleErrors ? errors.join(' | ') : '无'}`)
    ok = ok && checks.swRegistered && checks.consoleErrors === 0

    ws.close()
    process.exitCode = ok ? 0 : 1
  } finally {
    chrome.kill()
    preview.kill()
    try { rmSync(profile, { recursive: true, force: true }) } catch {}
  }
}

main().catch((e) => { console.error('FATAL', e.message); process.exit(1) })
