// scripts/interaction-check.mjs
//
// 真实浏览器交互验证（headless Chrome + CDP）：在构建产物上真点、真判，而不是只看页面渲染。
//
// 覆盖：
//   1. 安静书：多选收集 / 点错摇一摇 / 整页完成 + 得星 / 「谁不见了」记忆阶段 / 页码
//   2. 今日小挑战：答题 → 纠正 → 结算 + 答错回顾 → 再玩一次全对 → 闯关成功 + 得星 + 横幅状态
//   3. 脑筋急转弯小挑战：谜面 + 3 个谜底选项
//   4. 静音兜底：听音题不泄露答案且入口禁用；看题类挑战仍可玩
//   5. 数学练习：数一数/加减法 → 答对反馈 → 换一题 → 答错反馈
//   6. 儿童歌谣：连唱逐句推进 / 下一句 / 想一想展开收起 / 关闭弹层
//   7. 语音接力 / 故事配图与学情条 / 数学 10-20 与筛选 / 路由回顶部
//   8. 路由标题与焦点 / 未知地址回首页 / 学情数据容错
//   9. 弹层焦点循环 + 背景 inert + body 滚动锁
//  10. PWA：离线冷启动 + 离线懒加载栏目
//  11. 家长报告 / 首页续学直达条目 / 错题优先出题 / 两步确认清空
//  12. 年龄筛选（数学 / 拼音 / 安静书）/ 拼音声调与易混分组 / 数学分步提示
//
// 用法（先 npm run build）：
//   npm run check:interactions
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PREVIEW_PORT = 4600 + Math.floor(Math.random() * 400)
const CDP_PORT = 9100 + Math.floor(Math.random() * 300)
const HOST = '127.0.0.1'
const BASE = `http://${HOST}:${PREVIEW_PORT}/`

/** 本地时区 YYYY-MM-DD，offset 为相对今天的天数 */
function dateKey(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/** 从源码读取脑筋急转弯 id，用于「全部学过 + 只剩错题」的个性化测试 */
const brainteaserIds = [
  ...readFileSync(path.join(ROOT, 'src', 'data', 'brainteasers.ts'), 'utf8').matchAll(
    /id:\s*'([^']+)'/g
  ),
].map((m) => m[1])

/** 各栏目 total（家长报告完成度断言），随内容扩充自动更新 */
const moduleTotals = Object.fromEntries(
  [
    ...readFileSync(path.join(ROOT, 'src', 'data', 'categories.ts'), 'utf8').matchAll(
      /module:\s*'([^']+)',\s*total:\s*(\d+)/g
    ),
  ].map((m) => [m[1], Number(m[2])])
)
const totalContent = Object.values(moduleTotals).reduce((sum, n) => sum + n, 0)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function findChrome() {
  return [
    process.env.CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ]
    .filter(Boolean)
    .find((p) => existsSync(p))
}

function killTree(child) {
  if (!child?.pid) return
  if (process.platform === 'win32') {
    try {
      spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
    } catch {}
  } else {
    child.kill()
  }
}

async function main() {
  if (!existsSync(path.join(ROOT, 'dist', 'index.html'))) {
    throw new Error('dist/index.html 不存在,请先 npm run build')
  }
  const chromePath = findChrome()
  if (!chromePath) throw new Error('找不到 Chrome/Edge')

  const viteBin = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
  const preview = spawn(
    process.execPath,
    [viteBin, 'preview', '--port', String(PREVIEW_PORT), '--host', HOST, '--strictPort'],
    { stdio: 'ignore' }
  )

  let previewOk = false
  for (let i = 0; i < 40; i++) {
    await sleep(250)
    try {
      if ((await fetch(BASE)).ok) {
        previewOk = true
        break
      }
    } catch {}
  }
  if (!previewOk) {
    killTree(preview)
    throw new Error('vite preview 未就绪')
  }

  const profile = mkdtempSync(path.join(tmpdir(), 'kids-edu-check-'))
  const chrome = spawn(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--mute-audio',
      '--autoplay-policy=no-user-gesture-required',
      `--remote-debugging-port=${CDP_PORT}`,
      `--user-data-dir=${profile}`,
      BASE,
    ],
    { stdio: 'ignore' }
  )

  try {
    let page = null
    for (let i = 0; i < 40; i++) {
      await sleep(250)
      try {
        const targets = await (await fetch(`http://${HOST}:${CDP_PORT}/json`)).json()
        page = targets.find((t) => t.type === 'page')
        if (page) break
      } catch {}
    }
    if (!page) throw new Error('无法连接 CDP')

    const ws = new WebSocket(page.webSocketDebuggerUrl)
    let msgId = 0
    const pending = new Map()
    const consoleErrors = []

    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id)
        pending.delete(msg.id)
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)
      } else if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(msg.params.exceptionDetails?.text || 'exception')
      } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '))
      } else if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        consoleErrors.push(msg.params.entry.text)
      }
    }
    await new Promise((res, rej) => {
      ws.onopen = res
      ws.onerror = rej
    })

    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = ++msgId
        pending.set(id, { resolve, reject })
        ws.send(JSON.stringify({ id, method, params }))
      })

    const evaluate = async (expression) => {
      const r = await send('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true,
      })
      if (r?.exceptionDetails) throw new Error(r.exceptionDetails.text || '页面脚本异常')
      return r?.result?.value
    }

    const waitFor = async (expression, timeout = 8000, label = expression) => {
      const deadline = Date.now() + timeout
      while (Date.now() < deadline) {
        if (await evaluate(`!!(${expression})`)) return
        await sleep(150)
      }
      throw new Error(`等待超时: ${label}`)
    }

    const go = async (route) => {
      await send('Page.navigate', { url: `${BASE}#/${route}` })
      await sleep(500)
    }

    const clickAt = async (selector, index = 0) => {
      const ok = await evaluate(`(() => {
        const el = document.querySelectorAll(${JSON.stringify(selector)})[${index}]
        if (!el) return false
        el.click()
        return true
      })()`)
      if (!ok) throw new Error(`找不到可点击元素 ${selector}[${index}]`)
    }

    const clickText = async (selector, text) => {
      const ok = await evaluate(`(() => {
        const el = [...document.querySelectorAll(${JSON.stringify(selector)})]
          .find((e) => e.textContent.includes(${JSON.stringify(text)}))
        if (!el) return false
        el.click()
        return true
      })()`)
      if (!ok) throw new Error(`找不到文案为「${text}」的 ${selector}`)
    }

    const textOf = (selector) =>
      evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent?.trim() ?? ''`)
    const countOf = (selector) =>
      evaluate(`document.querySelectorAll(${JSON.stringify(selector)}).length`)
    const waitAskChange = async (oldAsk, timeout = 6000) => {
      await waitFor(
        `(() => {
          const el = document.querySelector('.qb-ask')
          return el && el.textContent.trim() !== ${JSON.stringify(oldAsk)}
        })()`,
        timeout,
        '进入下一回合'
      )
    }

    const results = []
    const step = async (name, fn) => {
      try {
        await fn()
        console.log(`✓ ${name}`)
        results.push({ name, ok: true })
      } catch (e) {
        console.error(`✗ ${name}: ${e.message}`)
        results.push({ name, ok: false, reason: e.message })
      }
    }

    await send('Runtime.enable')
    await send('Log.enable')
    await send('Page.enable')

    /* ================= 1. 安静书 ================= */
    await step('安静书：打开即玩 + 多选收集', async () => {
      await go('quietbook')
      await waitFor(`document.querySelector('.qb-opt')`, 8000, '安静书选项')
      const title = await textOf('.qb-pagetitle')
      if (!title.includes('穿衣小帮手')) throw new Error(`当前页不是第 1 页: ${title}`)
    })

    await step('安静书：点错摇一摇（不扣进度）', async () => {
      // 第 1 轮答案 [0,1,2]；先点第 4 个（短袖，错的）
      await clickAt('.qb-opt', 3)
      await waitFor(`document.querySelector('.qb-opt.qb-wrong')`, 2000, '点错样式')
      await sleep(700)
      if (await evaluate(`!!document.querySelector('.qb-opt.qb-wrong')`)) {
        throw new Error('点错样式 520ms 后仍未复位')
      }
      if ((await countOf('.qb-tray-item')) !== 0) throw new Error('点错却进了小篮子')
    })

    await step('安静书：第 1 页三回合 → 完成庆祝 + 得星', async () => {
      const answer = [0, 1, 2]
      // 第 1 回合
      for (const i of answer) {
        await clickAt('.qb-opt', i)
        await sleep(160)
      }
      await waitFor(`document.querySelector('.qb-ask')?.textContent.includes('太阳大大的')`, 5000, '进入第 2 回合')
      // 第 2 回合（此时错误样式已复位）
      for (const i of answer) {
        await clickAt('.qb-opt', i)
        await sleep(160)
      }
      await waitFor(`document.querySelector('.qb-ask')?.textContent.includes('下雨啦')`, 5000, '进入第 3 回合')
      // 第 3 回合
      for (const i of answer) {
        await clickAt('.qb-opt', i)
        await sleep(160)
      }
      await waitFor(`document.querySelector('.qb-done')`, 6000, '完成庆祝屏')
      const doneText = await textOf('.qb-done-title')
      if (!doneText.includes('第 一 页完成啦')) throw new Error(`完成文案异常: ${doneText}`)
      const progressText = await textOf('.qb-progress-num')
      if (!progressText.includes('完成 1/9 页')) throw new Error(`进度未更新: ${progressText}`)
      const prog = await evaluate(`JSON.parse(localStorage.getItem('kids-edu-progress') || '{}')`)
      if (!(prog.learned ?? []).includes('quietbook:dress')) throw new Error('未写入 quietbook:dress')
      if (!(prog.stars >= 1)) throw new Error('未获得星星')
    })

    await step('安静书：谁不见了 → 记忆阶段 4.5 秒后才出选项', async () => {
      await clickText('.qb-chip', '谁不见了')
      await waitFor(`document.querySelector('.qb-memory')`, 5000, '记忆阶段提示')
      if ((await countOf('.qb-opt')) !== 0) throw new Error('记忆阶段不应显示选项')
      await waitFor(`document.querySelectorAll('.qb-opt').length > 0`, 6000, '记忆阶段结束')
      let found = false
      const optionCount = await countOf('.qb-opt')
      for (let i = 0; i < optionCount; i++) {
        await clickAt('.qb-opt', i)
        await sleep(650)
        if (await evaluate(`!!document.querySelector('.qb-opt.qb-correct')`)) {
          found = true
          break
        }
      }
      if (!found) throw new Error('逐个尝试后仍未点中躲起来的小伙伴')
    })

    await step('安静书：影子配对 → 答对高亮', async () => {
      await clickText('.qb-chip', '影子找朋友')
      await waitFor(
        `document.querySelector('.qb-pagetitle')?.textContent.includes('影子找朋友')`,
        5000,
        '切换到影子页'
      )
      await waitFor(`document.querySelector('.qb-opt')`, 5000, '影子页选项')
      const optionCount = await countOf('.qb-opt')
      let found = false
      for (let i = 0; i < optionCount; i++) {
        await clickAt('.qb-opt', i)
        await sleep(650)
        if (await evaluate(`!!document.querySelector('.qb-opt.qb-correct')`)) {
          found = true
          break
        }
      }
      if (!found) throw new Error('影子配对答对后没有绿色高亮')
    })

    await step('安静书：颜色点点 → 点错复位 → 5 回合完成', async () => {
      await clickText('.qb-chip', '颜色点点')
      await waitFor(
        `document.querySelector('.qb-pagetitle')?.textContent.includes('颜色点点')`,
        5000,
        '切换到颜色页'
      )
      await waitFor(`document.querySelector('.qb-opt')`, 5000, '颜色页选项')
      if ((await countOf('.qb-opt .qb-dot')) !== 5) throw new Error('颜色小球没有渲染成色块')

      // 先点错：第 2 个是黄色，题目问红色
      await clickAt('.qb-opt', 1)
      await waitFor(`document.querySelector('.qb-opt.qb-wrong')`, 2000, '点错样式')
      await sleep(700)
      if (await evaluate(`!!document.querySelector('.qb-opt.qb-wrong')`)) {
        throw new Error('点错样式未复位')
      }

      let ask = await textOf('.qb-ask')
      await clickAt('.qb-opt', 0) // 每回合正确答案都在 0
      for (let r = 1; r < 5; r++) {
        await waitAskChange(ask)
        if (await evaluate(`!!document.querySelector('.qb-done')`)) {
          throw new Error(`第 ${r} 回合就提前完成了`)
        }
        ask = await textOf('.qb-ask')
        await waitFor(
          `[...document.querySelectorAll('.qb-opt')].every((el) => !el.disabled)`,
          5000,
          `第 ${r + 1} 回合可作答`
        )
        await clickAt('.qb-opt', 0)
      }
      await waitFor(`document.querySelector('.qb-done')`, 6000, '颜色页完成屏')
      const doneText = await textOf('.qb-done-title')
      if (!doneText.includes('第 二 页完成啦')) throw new Error(`完成文案异常: ${doneText}`)
      const prog = await evaluate(`JSON.parse(localStorage.getItem('kids-edu-progress') || '{}')`)
      if (!(prog.learned ?? []).includes('quietbook:colors')) throw new Error('未写入 quietbook:colors')
    })

    await step('安静书：找不同 → 对照上排找出全部差异 → 3 回合完成', async () => {
      await clickText('.qb-chip', '找不同')
      await waitFor(
        `document.querySelector('.qb-pagetitle')?.textContent.includes('找不同')`,
        5000,
        '切换到找不同页'
      )
      for (let round = 0; round < 3; round++) {
        await waitFor(`document.querySelector('.qb-ref')`, 5000, '对照栏')
        await waitFor(`document.querySelector('.qb-opt')`, 5000, '找不同选项')
        const diffs = await evaluate(`(() => {
          const refs = [...document.querySelectorAll('.qb-ref .qb-ref-cell')].map((e) => e.textContent.trim())
          const opts = [...document.querySelectorAll('.qb-opt')].map((e) => e.textContent.trim())
          return opts.map((t, i) => (t !== refs[i] ? i : -1)).filter((i) => i >= 0)
        })()`)
        if (diffs.length !== 2) throw new Error(`第 ${round + 1} 回合差异数异常: ${diffs.length}`)
        for (const i of diffs) {
          await clickAt('.qb-opt', i)
          await sleep(220)
        }
        if ((await countOf('.qb-opt.qb-picked')) !== 2) throw new Error('差异项没有全部收下')
        if (round < 2) {
          const ask = await textOf('.qb-ask')
          await waitAskChange(ask)
        }
      }
      await waitFor(`document.querySelector('.qb-done')`, 6000, '找不同完成屏')
      const doneText = await textOf('.qb-done-title')
      if (!doneText.includes('第 七 页完成啦')) throw new Error(`完成文案异常: ${doneText}`)
      const prog = await evaluate(`JSON.parse(localStorage.getItem('kids-edu-progress') || '{}')`)
      if (!(prog.learned ?? []).includes('quietbook:spot')) throw new Error('未写入 quietbook:spot')
    })

    await step('安静书：第 9 页显示「第九页」而不是数字', async () => {
      await clickAt('.qb-chip', 8)
      await waitFor(
        `document.querySelector('.qb-pageno')?.textContent.includes('九')`,
        5000,
        '第 9 页中文页码'
      )
    })

    /* ================= 2. 今日小挑战 ================= */
    await step('今日小挑战：5 题作答 → 纠正 → 结算', async () => {
      await go('encyclopedia')
      await waitFor(`document.querySelector('.challenge-banner')`, 8000, '挑战入口')
      await clickAt('.challenge-banner', 0)
      await waitFor(`document.querySelector('.cq-opt')`, 5000, '闯关弹层')

      const correctIdx = []
      for (let q = 0; q < 5; q++) {
        await waitFor(
          `[...document.querySelectorAll('.cq-opt')].some((el) => !el.disabled)`,
          5000,
          `第 ${q + 1} 题可作答`
        )
        // 先点第 1 项；错了会在 900ms 后揭示正确项
        await clickAt('.cq-opt', 0)
        // 答错后必须等正确项揭示才能「下一题」，防止孩子错过纠错
        const wrongNow = await evaluate(`!!document.querySelector('.cq-opt-wrong')`)
        if (wrongNow) {
          const locked = await evaluate(`document.querySelector('.cq-actions .btn')?.disabled === true`)
          if (!locked) throw new Error(`第 ${q + 1} 题答错后未揭示就能进入下一题`)
        }
        await sleep(1100)
        if (wrongNow) {
          const reopened = await evaluate(`document.querySelector('.cq-actions .btn')?.disabled === false`)
          if (!reopened) throw new Error(`第 ${q + 1} 题揭示后仍无法进入下一题`)
        }
        const idx = await evaluate(
          `[...document.querySelectorAll('.cq-opt')].findIndex((el) => el.classList.contains('cq-opt-correct'))`
        )
        if (idx < 0) throw new Error(`第 ${q + 1} 题未能识别正确项`)
        correctIdx.push(idx)
        if (q < 4) {
          await clickText('.cq-actions .btn', '下一题')
          await sleep(350)
        } else {
          await clickText('.cq-actions .btn', '看结果')
        }
      }
      await waitFor(`document.querySelector('.cq-result')`, 5000, '结算屏')
      const score = await textOf('.cq-result-msg')
      if (!/答对了 \d \/ 5 题/.test(score)) throw new Error(`结算文案异常: ${score}`)
      // 答错回顾：答错几题就应列出几条（全对则不应出现）
      const got = Number((score.match(/答对了 (\d+)/) ?? [])[1])
      if (got < 5) {
        const reviewCount = await countOf('.cq-review-list li')
        if (reviewCount !== 5 - got) {
          throw new Error(`答错回顾条目数不符: ${reviewCount} 条（答对 ${got} 题）`)
        }
      } else if ((await countOf('.cq-review')) !== 0) {
        throw new Error('全对却出现了答错回顾')
      }

      // 再玩一次：题目顺序不变，按记录的正确项答完
      await clickText('.cq-result-actions .btn', '再玩一次')
      await waitFor(`document.querySelector('.cq-opt')`, 5000, '重开后第一题')
      for (let q = 0; q < 5; q++) {
        await waitFor(
          `[...document.querySelectorAll('.cq-opt')].some((el) => !el.disabled)`,
          5000,
          `重开第 ${q + 1} 题可作答`
        )
        await clickAt('.cq-opt', correctIdx[q])
        await sleep(300)
        if (q < 4) {
          await clickText('.cq-actions .btn', '下一题')
          await sleep(300)
        } else {
          await clickText('.cq-actions .btn', '看结果')
        }
      }
      await waitFor(`document.querySelector('.cq-result-title')`, 5000, '重开结算屏')
      const title = await textOf('.cq-result-title')
      if (!title.includes('闯关成功')) throw new Error(`全对仍未通关: ${title}`)
      if ((await countOf('.cq-review')) !== 0) throw new Error('再玩一次全对后仍显示答错回顾')
      const prog = await evaluate(`JSON.parse(localStorage.getItem('kids-edu-progress') || '{}')`)
      const awarded = prog.quizAwarded ?? []
      if (!awarded.some((k) => k.startsWith('encyclopedia:'))) {
        throw new Error('未写入 encyclopedia 当日闯关记录')
      }
      await clickText('.cq-result-actions .btn', '完成')
      await waitFor(`!document.querySelector('.cq-result')`, 3000, '关闭闯关弹层')
      await sleep(300)
      // 今天已得过星：横幅要明确告诉孩子，避免「再答一次为什么没有星星」的疑惑
      const sub = await textOf('.ch-banner-sub')
      if (!sub.includes('今天已经得过')) throw new Error(`闯关后横幅状态未更新: ${sub}`)
    })

    /* ================= 2b. 脑筋急转弯小挑战 / 静音兜底 ================= */
    await step('脑筋急转弯小挑战：谜面 + 3 个谜底选项', async () => {
      await go('brainteasers')
      await waitFor(`document.querySelector('.challenge-banner')`, 8000, '脑筋急转弯挑战入口')
      await clickAt('.challenge-banner', 0)
      await waitFor(`document.querySelector('.cq-opt')`, 5000, '闯关弹层')

      const ask = await textOf('.cq-ask')
      if (!ask.includes('猜猜答案')) throw new Error(`引导语异常: ${ask}`)
      const prompt = await textOf('.cq-prompt')
      if (!prompt || !/[？?]$/.test(prompt)) throw new Error(`谜面未显示: ${prompt}`)
      if ((await countOf('.cq-opt')) !== 3) throw new Error('谜底选项不是 3 个')
      const blankOpt = await evaluate(
        `[...document.querySelectorAll('.cq-opt-label')].some((el) => !el.textContent.trim())`
      )
      if (blankOpt) throw new Error('存在空的谜底选项')

      await clickAt('.detail-card .close-btn', 0)
      await waitFor(`!document.querySelector('.detail-overlay')`, 3000, '关闭挑战')
    })

    await step('静音兜底：听音挑战禁用不泄露答案；看题挑战仍可玩', async () => {
      await go('encyclopedia')
      await waitFor(`document.querySelector('.challenge-banner')`, 8000, '挑战入口')
      await evaluate(`localStorage.setItem('kids-edu-muted', '1')`)
      await send('Page.reload')
      await waitFor(`document.querySelector('.challenge-banner')`, 10000, '静音后挑战入口')

      // 听音认物题静音时无法作答：入口置灰，点了只给提示，不弹题
      const off = await evaluate(
        `document.querySelector('.challenge-banner')?.classList.contains('challenge-off') === true`
      )
      if (!off) throw new Error('静音时听音挑战入口未置灰')
      const sub = await textOf('.ch-banner-sub')
      if (!sub.includes('打开声音')) throw new Error(`静音横幅文案未提示打开声音: ${sub}`)
      await clickAt('.challenge-banner', 0)
      await waitFor(`document.querySelector('.ch-banner-hint')`, 2000, '静音点击提示')
      if ((await countOf('.detail-overlay')) !== 0) throw new Error('静音时仍打开了听音挑战')
      if ((await countOf('.cq-say')) !== 0) throw new Error('静音提示出现在未打开的弹层里')

      // 唐诗接句是看题作答，不依赖听音：静音时照常可玩
      await go('tangshi')
      await waitFor(`document.querySelector('.challenge-banner')`, 8000, '唐诗挑战入口')
      if (
        await evaluate(
          `document.querySelector('.challenge-banner')?.classList.contains('challenge-off') === true`
        )
      ) {
        throw new Error('看题类挑战在静音时被误禁用')
      }
      await clickAt('.challenge-banner', 0)
      await waitFor(`document.querySelector('.cq-opt')`, 5000, '静音下的唐诗挑战')
      const prompt = await textOf('.cq-prompt')
      if (!prompt) throw new Error('看题挑战没有显示上一句')
      if ((await countOf('.cq-say')) !== 0) throw new Error('看题挑战仍显示静音提示')
      await clickAt('.detail-card .close-btn', 0)
      await waitFor(`!document.querySelector('.detail-overlay')`, 3000, '关闭唐诗挑战')

      await evaluate(`localStorage.setItem('kids-edu-muted', '0')`)
      await send('Page.reload')
      await waitFor(`document.querySelector('.challenge-banner')`, 10000, '恢复有声重新加载')
    })

    /* ================= 3. 数学练习 ================= */
    await step('数学练习：答对 → 反馈 → 换一题', async () => {
      await go('math')
      await waitFor(`document.querySelector('.quiz-opt')`, 8000, '数学练习面板')

      const readAnswer = async () => {
        const math = await textOf('.quiz-math')
        if (math) {
          const m = math.match(/(\d+)\s*([+-])\s*(\d+)/)
          if (!m) throw new Error(`无法解析题目: ${math}`)
          return m[2] === '+' ? Number(m[1]) + Number(m[3]) : Number(m[1]) - Number(m[3])
        }
        return countOf('.quiz-dots span')
      }
      const answer = await readAnswer()
      const labels = await evaluate(
        `[...document.querySelectorAll('.quiz-opt')].map((e) => e.textContent.trim())`
      )
      const idx = labels.findIndex((l) => Number(l) === answer)
      if (idx < 0) throw new Error(`选项里找不到正确答案 ${answer}: ${labels.join(',')}`)
      await clickAt('.quiz-opt', idx)
      await waitFor(`document.querySelector('.quiz-opt.correct')`, 3000, '答对样式')
      const fb = await textOf('.quiz-feedback')
      if (!fb) throw new Error('答对后没有反馈文案')
      if (await evaluate(`[...document.querySelectorAll('.quiz-opt')].some((el) => !el.disabled)`)) {
        throw new Error('作答后选项仍可点击')
      }

      await clickText('.quiz-actions .btn', '换一题')
      await sleep(300)
      await waitFor(
        `[...document.querySelectorAll('.quiz-opt')].every((el) => !el.disabled)`,
        3000,
        '换题后选项复位'
      )
      if (await evaluate(`!!document.querySelector('.quiz-opt.correct, .quiz-opt.wrong')`)) {
        throw new Error('换题后仍残留上一题的对错样式')
      }
    })

    await step('数学练习：答错 → 错误反馈', async () => {
      const math = await textOf('.quiz-math')
      let answer
      if (math) {
        const m = math.match(/(\d+)\s*([+-])\s*(\d+)/)
        answer = m[2] === '+' ? Number(m[1]) + Number(m[3]) : Number(m[1]) - Number(m[3])
      } else {
        answer = await countOf('.quiz-dots span')
      }
      const labels = await evaluate(
        `[...document.querySelectorAll('.quiz-opt')].map((e) => e.textContent.trim())`
      )
      const wrongIdx = labels.findIndex((l) => Number(l) !== answer)
      if (wrongIdx < 0) throw new Error('找不到错误选项')
      await clickAt('.quiz-opt', wrongIdx)
      await waitFor(`document.querySelector('.quiz-opt.wrong')`, 3000, '答错样式')
      const fb = await textOf('.quiz-feedback')
      if (!fb) throw new Error('答错后没有反馈文案')

      // 分步提示：答错后 / 主动点「提示」都应给出思路
      await clickText('.quiz-actions .btn', '提示')
      await waitFor(
        `document.querySelector('.quiz-feedback')?.textContent.includes('提示：')`,
        3000,
        '分步提示'
      )
    })

    /* ================= 4. 儿童歌谣 ================= */
    await step('儿童歌谣：连唱一遍逐句推进', async () => {
      await go('nursery')
      await waitFor(`document.querySelector('.big-card')`, 8000, '歌谣卡片')
      await clickAt('.big-card', 0)
      await waitFor(`document.querySelector('.rhyme-view')`, 5000, '歌谣弹层')
      const before = await textOf('.rhyme-line-num')
      await clickText('.rhyme-nav .btn', '连唱一遍')
      let advanced = false
      for (let i = 0; i < 40; i++) {
        await sleep(300)
        if ((await textOf('.rhyme-line-num')) !== before) {
          advanced = true
          break
        }
      }
      if (!advanced) throw new Error('连唱 12 秒仍未推进到下一句')
      const hasStop = await evaluate(
        `[...document.querySelectorAll('.rhyme-nav .btn')].some((b) => b.textContent.includes('停'))`
      )
      if (hasStop) await clickText('.rhyme-nav .btn', '停')
    })

    await step('儿童歌谣：下一句 / 想一想 / 关闭', async () => {
      // 连唱可能已经停在最后一句，先把「下一句」变成可点状态
      const nextDisabled = await evaluate(`(() => {
        const b = [...document.querySelectorAll('.rhyme-nav .btn')].find((e) => e.textContent.includes('下一句'))
        return !b || b.disabled
      })()`)
      if (nextDisabled) {
        await clickText('.rhyme-nav .btn', '上一句')
        await sleep(500)
      }
      const before = await textOf('.rhyme-line-num')
      await clickText('.rhyme-nav .btn', '下一句')
      await sleep(500)
      if ((await textOf('.rhyme-line-num')) === before) throw new Error('下一句没有推进')

      await clickText('.tip-toggle', '想一想')
      await waitFor(`document.querySelector('.rhyme-tip')`, 3000, '想一想内容')
      const tip = await textOf('.rhyme-tip')
      if (!tip) throw new Error('想一想内容为空')
      await clickText('.tip-toggle', '收起想一想')
      await sleep(400)
      if (await evaluate(`!!document.querySelector('.rhyme-tip')`)) {
        throw new Error('收起后想一想仍显示')
      }

      await clickAt('.detail-card .close-btn', 0)
      await waitFor(`!document.querySelector('.rhyme-view')`, 3000, '关闭歌谣弹层')
    })

    /* ================= 5. 长文本语音接力 ================= */
    await step('语音：长文本按句拆成多个 utterance 接力', async () => {
      await go('encyclopedia')
      await waitFor(`document.querySelector('.big-card')`, 8000, '百科卡片')
      await evaluate(`(() => {
        window.__speakCalls = 0
        const synth = window.speechSynthesis
        if (!synth.__patched) {
          const orig = synth.speak.bind(synth)
          synth.speak = (u) => { window.__speakCalls++; return orig(u) }
          synth.__patched = true
        }
        return true
      })()`)
      await clickText('.big-card', '太阳')
      await waitFor(`document.querySelector('.detail-text')`, 5000, '百科详情')
      await waitFor(`window.__speakCalls >= 2`, 10000, '第二个 utterance')
      const calls = await evaluate('window.__speakCalls')
      if (calls < 2) throw new Error(`只触发了 ${calls} 个 utterance`)
      await clickAt('.detail-card .close-btn', 0)
      await waitFor(`!document.querySelector('.detail-text')`, 3000, '关闭详情')
    })

    /* ================= 5.5 本轮优化回归 ================= */
    await step('故事：学情条 + 老牛配图', async () => {
      await go('stories')
      await waitFor(`document.querySelector('.big-card')`, 8000, '绘本卡片')
      if (!(await evaluate(`!!document.querySelector('.module-bar')`))) {
        throw new Error('绘本页缺少学情条')
      }
      await clickText('.big-card', '小马过河')
      await waitFor(`document.querySelector('.story-view')`, 5000, '绘本弹层')
      await clickText('.story-nav .btn', '下一页')
      await sleep(300)
      await clickText('.story-nav .btn', '下一页')
      await sleep(300)
      const emoji = await textOf('.story-emoji')
      if (!emoji.includes('🐮')) throw new Error(`第 3 页老牛配图异常: ${emoji}`)
      await clickAt('.detail-card .close-btn', 0)
      await waitFor(`!document.querySelector('.story-view')`, 3000, '关闭绘本')
    })

    await step('数学：10-20 内容 + 学情筛选', async () => {
      await go('math')
      await waitFor(`document.querySelector('.big-card')`, 8000, '数字卡片')
      if (!(await evaluate(`!!document.querySelector('.module-bar')`))) {
        throw new Error('数学页缺少学情条')
      }
      if (!(await evaluate(`document.body.innerText.includes('二十')`))) {
        throw new Error('页面没有「二十」')
      }
      const total = await countOf('.big-card')
      if (total !== 21) throw new Error(`数字卡片应为 21 张，实际 ${total}`)

      await clickText('.big-card', '二十')
      await waitFor(`document.querySelector('.num-big')`, 5000, '数字详情')
      if ((await textOf('.num-big')) !== '20') throw new Error('20 的详情数字不对')
      const dots = await countOf('.num-dots span')
      if (dots !== 20) throw new Error(`20 的圆点应为 20 个，实际 ${dots}`)
      await clickAt('.detail-card .close-btn', 0)
      await waitFor(`!document.querySelector('.num-big')`, 3000, '关闭数字详情')

      await clickAt('.chip-btn', 2) // 学过（注意不能用 clickText：会先命中「没学过」）
      await sleep(300)
      if ((await countOf('.big-card')) !== 1) throw new Error('「学过」筛选应只剩 1 张')
      await clickAt('.chip-btn', 1) // 没学过
      await sleep(300)
      if ((await countOf('.big-card')) !== 20) throw new Error('「没学过」筛选应为 20 张')
      await clickAt('.chip-btn', 0) // 全部
      await sleep(300)
      if ((await countOf('.big-card')) !== 21) throw new Error('「全部」筛选应恢复 21 张')
    })

    await step('年龄筛选：数学 3–4 / 5–6 分段', async () => {
      await go('math')
      await waitFor(`document.querySelector('.big-card')`, 8000, '数字卡片')
      await clickText('.age-chips .chip-btn', '3–4 岁')
      await sleep(300)
      if ((await countOf('.big-card')) !== 10) throw new Error('数学 3–4 岁应为 10 张')
      await clickText('.age-chips .chip-btn', '5–6 岁')
      await sleep(300)
      if ((await countOf('.big-card')) !== 11) throw new Error('数学 5–6 岁应为 11 张')
      await clickText('.age-chips .chip-btn', '全部年龄')
      await sleep(300)
      if ((await countOf('.big-card')) !== 21) throw new Error('数学「全部年龄」应恢复 21 张')
    })

    await step('拼音：声调 / 易混分组 + 年龄筛选', async () => {
      await go('pinyin')
      await waitFor(`document.querySelector('.big-card')`, 8000, '拼音卡片')
      if ((await countOf('.big-card')) !== 75) throw new Error('拼音卡片应为 75 张')
      const body = await evaluate('document.body.innerText')
      if (!body.includes('声调') || !body.includes('易混')) {
        throw new Error('缺少声调 / 易混分组')
      }
      await clickText('.age-chips .chip-btn', '3–4 岁')
      await sleep(300)
      if ((await countOf('.big-card')) !== 27) throw new Error('拼音 3–4 岁应为 27 张')
      await clickText('.age-chips .chip-btn', '5–6 岁')
      await sleep(300)
      if ((await countOf('.big-card')) !== 48) throw new Error('拼音 5–6 岁应为 48 张')
      await clickText('.age-chips .chip-btn', '全部年龄')
      await sleep(300)
      if ((await countOf('.big-card')) !== 75) throw new Error('拼音「全部年龄」应恢复 75 张')
    })

    await step('年龄筛选：安静书按年龄段切换书页', async () => {
      await go('quietbook')
      await waitFor(`document.querySelector('.qb-chip')`, 8000, '安静书书页')
      if ((await countOf('.qb-chip')) !== 9) throw new Error('安静书应显示 9 页')
      await clickText('.age-chips .chip-btn', '5–6 岁')
      await sleep(400)
      if ((await countOf('.qb-chip')) !== 3) throw new Error('安静书 5–6 岁应为 3 页')
      await clickText('.age-chips .chip-btn', '3–4 岁')
      await sleep(400)
      if ((await countOf('.qb-chip')) !== 6) throw new Error('安静书 3–4 岁应为 6 页')
      await clickText('.age-chips .chip-btn', '全部年龄')
      await sleep(400)
      if ((await countOf('.qb-chip')) !== 9) throw new Error('安静书「全部年龄」应恢复 9 页')
    })

    await step('路由：进入栏目回到顶部', async () => {
      await go('')
      await waitFor(`document.querySelector('.big-card')`, 8000, '首页')
      await evaluate(`window.scrollTo(0, document.body.scrollHeight)`)
      await sleep(300)
      if ((await evaluate('window.scrollY')) < 100) throw new Error('首页未成功滚动')
      await clickText('.big-card', '儿童歌谣')
      await waitFor(`location.hash.includes('/nursery')`, 5000, '进入歌谣栏目')
      await sleep(700)
      const y = await evaluate('window.scrollY')
      if (y > 50) throw new Error(`进入栏目后仍在滚动位置 ${y}`)
    })

    await step('路由：标题同步 + 焦点落到主内容', async () => {
      await go('math')
      await waitFor(`document.title.includes('数学启蒙')`, 4000, '页面标题同步')
      await waitFor(`document.activeElement?.id === 'main'`, 4000, '焦点移到 main')
    })

    await step('路由：未知地址回首页', async () => {
      await go('no-such-page')
      await waitFor(`location.hash === '#/'`, 4000, '重定向到首页')
      await waitFor(`document.querySelectorAll('.big-card').length >= 10`, 8000, '首页卡片')
      if (!(await evaluate(`document.title.includes('宝宝乐园')`))) {
        throw new Error('回首页后标题未更新')
      }
    })

    await step('学情：脏数据不崩、残留 id 不越界，刷新后仍在', async () => {
      const raw = await evaluate(`localStorage.getItem('kids-edu-progress')`)
      const today = await evaluate(`(() => {
        const d = new Date()
        const p = (n) => String(n).padStart(2, '0')
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())
      })()`)
      try {
        // 正常数据：刷新后学情仍在
        await evaluate(`localStorage.setItem('kids-edu-progress', JSON.stringify({
          stars: 7,
          learned: ['math:num-1'],
          streak: 3,
          lastDate: ${JSON.stringify(today)},
          todayKeys: ['math:num-1'],
          quizAwarded: [],
          v: 2
        }))`)
        await send('Page.reload')
        await sleep(800)
        await waitFor(`document.querySelectorAll('.big-card').length >= 10`, 10000, '刷新后的首页卡片')
        const readMathCorner = () =>
          evaluate(`(() => {
            const card = [...document.querySelectorAll('.big-card')].find(
              (c) => c.querySelector('.card-title')?.textContent.trim() === '数学启蒙'
            )
            return card?.querySelector('.card-corner')?.textContent.trim() ?? ''
          })()`)
        let corner = await readMathCorner()
        if (corner !== '1/21') throw new Error(`刷新后数学角标异常: 「${corner}」`)
        if ((await textOf('.overall-line b')) !== '1') throw new Error('刷新后全站统计异常')

        // 被删条目残留的旧 id 可能超过实际总量：展示时按总量截断
        await evaluate(`localStorage.setItem('kids-edu-progress', JSON.stringify({
          stars: 7,
          learned: Array.from({ length: 25 }, (_, i) => 'math:ghost-' + i),
          streak: 3,
          lastDate: ${JSON.stringify(today)},
          todayKeys: [],
          quizAwarded: [],
          v: 2
        }))`)
        await send('Page.reload')
        await sleep(800)
        await waitFor(`document.querySelectorAll('.big-card').length >= 10`, 10000, '残留 id 首页')
        corner = await readMathCorner()
        if (corner !== '21/21') throw new Error(`残留 id 未截断，数学角标为「${corner}」`)

        // 结构损坏 / 类型不对：回退默认值，不白屏
        await evaluate(`localStorage.setItem('kids-edu-progress', JSON.stringify({
          stars: '9', learned: {}, streak: null, lastDate: 123, todayKeys: 'x', quizAwarded: 5
        }))`)
        await send('Page.reload')
        await sleep(800)
        await waitFor(`document.querySelectorAll('.big-card').length >= 10`, 10000, '脏数据下的首页')
        if ((await textOf('.stat-num')) !== '0') throw new Error('非法 stars 没有回退为 0')
      } finally {
        await evaluate(
          raw === null
            ? `localStorage.removeItem('kids-edu-progress')`
            : `localStorage.setItem('kids-edu-progress', ${JSON.stringify(raw)})`
        )
        await send('Page.reload')
        await sleep(800)
        await waitFor(`document.querySelectorAll('.big-card').length >= 10`, 10000, '恢复学情数据')
      }
    })

    /* ================= 5b. 家长报告 / 续学 / 个性化 ================= */
    const seedRaw = await evaluate(`localStorage.getItem('kids-edu-progress')`)
    const seedLast = await evaluate(`localStorage.getItem('kids-edu-last')`)

    await step('续学：首页继续卡直达最近条目，地址参数自动清理', async () => {
      const today = dateKey()
      const seed = JSON.stringify({
        stars: 5,
        learned: ['math:num-1'],
        streak: 1,
        lastDate: today,
        todayKeys: ['math:num-1'],
        quizAwarded: [],
        last: { module: 'math', id: 'num-7' },
        history: {},
        wrong: {},
        v: 3,
      })
      try {
        await evaluate(`localStorage.setItem('kids-edu-progress', ${JSON.stringify(seed)})`)
        await evaluate(`localStorage.setItem('kids-edu-last', '/math')`)
        await send('Page.reload')
        await sleep(800)
        await waitFor(`document.querySelector('.continue-card')`, 10000, '首页继续卡')
        const sub = await textOf('.continue-card .card-subtitle')
        if (!sub.includes('数学启蒙')) throw new Error(`继续卡栏目异常: ${sub}`)

        await clickAt('.continue-card', 0)
        await waitFor(
          `location.hash.includes('/math') && location.hash.includes('open=num-7')`,
          5000,
          '续学地址'
        )
        await waitFor(`document.querySelector('.detail-overlay')`, 5000, '续学详情')
        if ((await textOf('.num-big')) !== '7') throw new Error('续学没有打开 num-7')
        await waitFor(`!location.hash.includes('open=')`, 5000, '清除续学参数')
        // 清理参数属于同路径导航，不应把焦点从详情弹层抢回 main
        const focusInside = await evaluate(
          `document.querySelector('.detail-overlay')?.contains(document.activeElement) === true`
        )
        if (!focusInside) throw new Error('清理参数后焦点被抢回主内容')

        await clickAt('.detail-card .close-btn', 0)
        await waitFor(`!document.querySelector('.detail-overlay')`, 3000, '关闭续学详情')
      } finally {
        await evaluate(
          seedRaw === null
            ? `localStorage.removeItem('kids-edu-progress')`
            : `localStorage.setItem('kids-edu-progress', ${JSON.stringify(seedRaw)})`
        )
        await evaluate(
          seedLast === null
            ? `localStorage.removeItem('kids-edu-last')`
            : `localStorage.setItem('kids-edu-last', ${JSON.stringify(seedLast)})`
        )
      }
    })

    await step('续学：安静书直达上次玩的那一页', async () => {
      const today = dateKey()
      const seed = JSON.stringify({
        stars: 2,
        learned: ['quietbook:dress'],
        streak: 1,
        lastDate: today,
        todayKeys: [],
        quizAwarded: [],
        last: { module: 'quietbook', id: 'colors' },
        history: {},
        wrong: {},
        v: 3,
      })
      try {
        await evaluate(`localStorage.setItem('kids-edu-progress', ${JSON.stringify(seed)})`)
        await evaluate(`localStorage.setItem('kids-edu-last', '/quietbook')`)
        await go('')
        await send('Page.reload')
        await sleep(800)
        await waitFor(`document.querySelector('.continue-card')`, 10000, '首页继续卡')
        await clickAt('.continue-card', 0)
        await waitFor(`location.hash.includes('/quietbook')`, 5000, '进入安静书')
        await waitFor(
          `document.querySelector('.qb-pagetitle')?.textContent.includes('颜色点点')`,
          6000,
          '安静书续到上次页码'
        )
        await waitFor(`!location.hash.includes('open=')`, 5000, '安静书清理续学参数')
      } finally {
        await evaluate(
          seedRaw === null
            ? `localStorage.removeItem('kids-edu-progress')`
            : `localStorage.setItem('kids-edu-progress', ${JSON.stringify(seedRaw)})`
        )
        await evaluate(
          seedLast === null
            ? `localStorage.removeItem('kids-edu-last')`
            : `localStorage.setItem('kids-edu-last', ${JSON.stringify(seedLast)})`
        )
      }
    })

    await step('家长报告：今日/7 天/栏目完成度 + 错题入口', async () => {
      const today = dateKey()
      const yesterday = dateKey(-1)
      const seed = JSON.stringify({
        stars: 9,
        learned: ['math:num-1', 'math:num-2', 'hanzi:one'],
        streak: 4,
        lastDate: today,
        todayKeys: ['math:num-1', 'math:num-2'],
        quizAwarded: [`math:${today}`],
        last: { module: 'brainteasers', id: 'water' },
        history: {
          [today]: { learned: 3, stars: 2, quiz: 1 },
          [yesterday]: { learned: 2, stars: 1, quiz: 0 },
        },
        wrong: {
          brainteasers: [
            {
              id: 'water',
              at: 2000,
              prompt: '什么东西越洗越脏？',
              answer: '是水。水越洗东西，自己反而越来越脏。',
            },
            {
              id: 'table',
              at: 1000,
              prompt: '什么东西有腿，却不会走路？',
              answer: '是桌子。桌子有四条腿，可是它不会走路。',
            },
          ],
        },
        v: 3,
      })
      try {
        await evaluate(`localStorage.setItem('kids-edu-progress', ${JSON.stringify(seed)})`)
        await go('parent')
        // hash 路由切换不会重新执行模块初始化；刷新一次才能让 useProgress 读到种子数据
        await send('Page.reload')
        await sleep(800)
        await waitFor(`document.querySelector('.parent-page')`, 8000, '家长报告')
        if (!(await evaluate(`document.title.includes('家长报告')`))) {
          throw new Error('报告页标题未同步')
        }

        const nums = await evaluate(
          `[...document.querySelectorAll('.parent-stats .stat-num')].map((e) => e.textContent.trim())`
        )
        if (nums.join('|') !== '2/3|9|4') throw new Error(`概览数字异常: ${nums.join('|')}`)
        if ((await countOf('.parent-week li')) !== 7) throw new Error('近 7 天不是 7 行')
        const d0 = await textOf('.parent-week li:nth-child(1) .parent-week-nums')
        const d1 = await textOf('.parent-week li:nth-child(2) .parent-week-nums')
        if (!d0.includes('学习 3 条') || !d0.includes('⭐ 2') || !d0.includes('闯关 1 次')) {
          throw new Error(`今天统计异常: ${d0}`)
        }
        if (!d1.includes('学习 2 条') || !d1.includes('⭐ 1')) {
          throw new Error(`昨天统计异常: ${d1}`)
        }
        const summary = await textOf('.parent-week-summary')
        if (!summary.includes('5 条') || !summary.includes('3 颗星') || !summary.includes('1 次')) {
          throw new Error(`近 7 天汇总异常: ${summary}`)
        }

        if ((await countOf('.parent-module')) !== 10) throw new Error('栏目完成度不是 10 项')
        const overall = await textOf('#parent-modules-title ~ .parent-lead')
        if (!overall.includes(`3 / ${totalContent}`)) throw new Error(`总进度异常: ${overall}`)
        const moduleCount = (name) =>
          evaluate(`(() => {
            const row = [...document.querySelectorAll('.parent-module')].find(
              (r) => r.querySelector('.parent-module-name')?.textContent.includes(${JSON.stringify(name)})
            )
            return row?.querySelector('.parent-module-count')?.textContent.trim() ?? ''
          })()`)
        if ((await moduleCount('数学启蒙')) !== `2/${moduleTotals.math}`) {
          throw new Error('数学完成度异常')
        }
        if ((await moduleCount('识字认字')) !== `1/${moduleTotals.hanzi}`) {
          throw new Error('识字完成度异常')
        }

        if ((await countOf('.parent-wrong-group')) !== 1) throw new Error('错题分组数异常')
        if ((await countOf('.parent-mistake-btn')) !== 2) throw new Error('错题条数异常')
        const firstMistake = await textOf('.parent-mistake-btn')
        if (!firstMistake.includes('越洗越脏') || !firstMistake.includes('正确答案')) {
          throw new Error(`错题文案异常: ${firstMistake}`)
        }

        await clickAt('.parent-mistake-btn', 0)
        await waitFor(
          `location.hash.includes('/brainteasers') && location.hash.includes('open=water')`,
          5000,
          '错题入口地址'
        )
        await waitFor(`document.querySelector('.detail-overlay')`, 5000, '错题详情')
        await waitFor(`!location.hash.includes('open=')`, 5000, '错题入口清理参数')
        await clickAt('.detail-card .close-btn', 0)
        await waitFor(`!document.querySelector('.detail-overlay')`, 3000, '关闭错题详情')
      } finally {
        await evaluate(
          seedRaw === null
            ? `localStorage.removeItem('kids-edu-progress')`
            : `localStorage.setItem('kids-edu-progress', ${JSON.stringify(seedRaw)})`
        )
        await evaluate(
          seedLast === null
            ? `localStorage.removeItem('kids-edu-last')`
            : `localStorage.setItem('kids-edu-last', ${JSON.stringify(seedLast)})`
        )
      }
    })

    await step('挑战个性化：全部学过后优先复习错题', async () => {
      const today = dateKey()
      const seed = JSON.stringify({
        stars: 40,
        learned: brainteaserIds.map((id) => `brainteasers:${id}`),
        streak: 2,
        lastDate: today,
        todayKeys: [],
        quizAwarded: [],
        last: { module: 'brainteasers', id: 'water' },
        history: {},
        wrong: {
          brainteasers: [
            {
              id: 'water',
              at: 2000,
              prompt: '什么东西越洗越脏？',
              answer: '是水。水越洗东西，自己反而越来越脏。',
            },
            {
              id: 'table',
              at: 1000,
              prompt: '什么东西有腿，却不会走路？',
              answer: '是桌子。桌子有四条腿，可是它不会走路。',
            },
          ],
        },
        v: 3,
      })
      try {
        await evaluate(`localStorage.setItem('kids-edu-progress', ${JSON.stringify(seed)})`)
        await go('brainteasers')
        await send('Page.reload')
        await sleep(800)
        await waitFor(`document.querySelector('.challenge-banner')`, 10000, '挑战入口')
        await clickAt('.challenge-banner', 0)
        await waitFor(`document.querySelector('.cq-prompt')`, 5000, '题目谜面')
        const first = await textOf('.cq-prompt')
        const retryPrompts = ['什么东西越洗越脏？', '什么东西有腿，却不会走路？']
        if (!retryPrompts.includes(first)) {
          throw new Error(`首题没有优先复习错题: ${first}`)
        }
        await clickAt('.detail-card .close-btn', 0)
        await waitFor(`!document.querySelector('.detail-overlay')`, 3000, '关闭个性化挑战')
      } finally {
        await evaluate(
          seedRaw === null
            ? `localStorage.removeItem('kids-edu-progress')`
            : `localStorage.setItem('kids-edu-progress', ${JSON.stringify(seedRaw)})`
        )
        await evaluate(
          seedLast === null
            ? `localStorage.removeItem('kids-edu-last')`
            : `localStorage.setItem('kids-edu-last', ${JSON.stringify(seedLast)})`
        )
      }
    })

    await step('家长报告：两步确认清空学习记录', async () => {
      const today = dateKey()
      const seed = JSON.stringify({
        stars: 6,
        learned: ['math:num-1', 'math:num-2'],
        streak: 2,
        lastDate: today,
        todayKeys: ['math:num-1', 'math:num-2'],
        quizAwarded: [],
        last: { module: 'math', id: 'num-2' },
        history: { [today]: { learned: 2, stars: 2, quiz: 0 } },
        wrong: {
          math: [{ id: 'num-1', at: 1000, prompt: '', answer: '一' }],
        },
        v: 3,
      })
      try {
        await evaluate(`localStorage.setItem('kids-edu-progress', ${JSON.stringify(seed)})`)
        await evaluate(`localStorage.setItem('kids-edu-last', '/math')`)
        await go('parent')
        await send('Page.reload')
        await sleep(800)
        await waitFor(`document.querySelector('.parent-page')`, 8000, '家长报告')
        await clickAt('.parent-reset', 0)
        if (!(await evaluate(`document.querySelector('.parent-reset')?.classList.contains('armed')`))) {
          throw new Error('第一次点击没有进入确认态')
        }
        if (!(await textOf('.reset-msg')).includes('再点一次')) {
          throw new Error('缺少二次确认提示')
        }

        await clickAt('.parent-reset', 0)
        await waitFor(
          `document.querySelector('.parent-stats .stat-num')?.textContent.trim() === '0/3'`,
          3000,
          '统计清零'
        )
        const prog = await evaluate(`JSON.parse(localStorage.getItem('kids-edu-progress') || '{}')`)
        if ((prog.learned ?? []).length) throw new Error('清空后仍有已学记录')
        if ((prog.stars ?? 0) !== 0) throw new Error('清空后星星不为 0')
        if (prog.last != null) throw new Error('清空后仍保留最近条目')
        if (Object.keys(prog.wrong ?? {}).length) throw new Error('清空后仍保留错题')
        if (Object.keys(prog.history ?? {}).length) throw new Error('清空后仍保留按天历史')
        if ((await evaluate(`localStorage.getItem('kids-edu-last')`)) !== null) {
          throw new Error('清空后仍保留旧版续学路径')
        }
        if (!(await textOf('.parent-empty')).includes('还没有答错的题')) {
          throw new Error('清空后错题区没有空状态')
        }

        await go('')
        await waitFor(`document.querySelector('.category-list')`, 8000, '首页')
        if (await evaluate(`!!document.querySelector('.continue-card')`)) {
          throw new Error('清空后首页仍显示继续学习')
        }
      } finally {
        await evaluate(
          seedRaw === null
            ? `localStorage.removeItem('kids-edu-progress')`
            : `localStorage.setItem('kids-edu-progress', ${JSON.stringify(seedRaw)})`
        )
        await evaluate(
          seedLast === null
            ? `localStorage.removeItem('kids-edu-last')`
            : `localStorage.setItem('kids-edu-last', ${JSON.stringify(seedLast)})`
        )
        await send('Page.reload')
        await sleep(600)
      }
    })

    await step('弹层：Tab 焦点循环 + 背景 inert', async () => {
      await go('encyclopedia')
      await waitFor(`document.querySelector('.big-card')`, 8000, '百科卡片')
      await clickText('.big-card', '太阳')
      await waitFor(`document.querySelector('.detail-overlay')`, 5000, '详情弹层')
      if (!(await evaluate(`document.querySelector('.app-shell')?.hasAttribute('inert')`))) {
        throw new Error('弹层打开时背景未 inert')
      }
      if ((await evaluate(`getComputedStyle(document.body).overflow`)) !== 'hidden') {
        throw new Error('弹层打开时 body 未锁滚动')
      }
      const tabOk = await evaluate(`(() => {
        const overlay = document.querySelector('.detail-overlay')
        const items = [...overlay.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        if (items.length < 2) return 'too-few'
        items[items.length - 1].focus()
        overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
        const forward = document.activeElement === items[0]
        items[0].focus()
        overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }))
        const backward = document.activeElement === items[items.length - 1]
        return forward && backward
      })()`)
      if (tabOk !== true) throw new Error(`焦点循环异常: ${tabOk}`)

      await clickAt('.detail-card .close-btn', 0)
      await waitFor(`!document.querySelector('.detail-overlay')`, 3000, '关闭详情')
      if (await evaluate(`document.querySelector('.app-shell')?.hasAttribute('inert')`)) {
        throw new Error('弹层关闭后背景仍 inert')
      }
      if ((await evaluate(`getComputedStyle(document.body).overflow`)) === 'hidden') {
        throw new Error('弹层关闭后 body 仍锁滚动')
      }
    })

    /* ================= 6. PWA 离线 ================= */
    let offlineErrorCount = 0
    await step('PWA：离线冷启动 + 离线懒加载栏目', async () => {
      await go('')
      await waitFor(`document.querySelector('.big-card')`, 8000, '首页')
      if (!(await evaluate('!!navigator.serviceWorker.controller'))) {
        await send('Page.reload')
        await waitFor(`document.querySelector('.big-card')`, 12000, '刷新后首页')
        await sleep(1000)
      }
      if (!(await evaluate('!!navigator.serviceWorker.controller'))) {
        throw new Error('Service Worker 未接管页面')
      }

      await send('Network.enable')
      await send('Network.emulateNetworkConditions', {
        offline: true,
        latency: 0,
        downloadThroughput: 0,
        uploadThroughput: 0,
      })
      const errStart = consoleErrors.length
      try {
        await send('Page.reload', { ignoreCache: true })
        await waitFor(
          `document.querySelectorAll('.big-card').length >= 10`,
          15000,
          '离线首页渲染'
        )
        // 点进拼音：验证懒加载 chunk 也从 SW 预缓存取到
        await clickText('.big-card', '拼音乐园')
        await waitFor(`document.body.innerText.includes('声母')`, 12000, '离线拼音栏目')
      } finally {
        offlineErrorCount = consoleErrors.length - errStart
        await send('Network.emulateNetworkConditions', {
          offline: false,
          latency: 0,
          downloadThroughput: -1,
          uploadThroughput: -1,
        })
        await sleep(500)
      }
    })

    /* ================= 汇总 ================= */
    ws.close()
    console.log('\n--- 汇总 ---')
    const failed = results.filter((r) => !r.ok)
    const onlineErrors = consoleErrors.slice(0, consoleErrors.length - offlineErrorCount)
    console.log(`通过 ${results.length - failed.length}/${results.length} 项`)
    console.log(
      `控制台错误: ${onlineErrors.length === 0 ? '无' : onlineErrors.join(' | ')}${
        offlineErrorCount > 0 ? `（离线窗口另有 ${offlineErrorCount} 条网络错误，已忽略）` : ''
      }`
    )
    const ok = failed.length === 0 && onlineErrors.length === 0
    process.exitCode = ok ? 0 : 1
  } finally {
    killTree(chrome)
    killTree(preview)
    try {
      rmSync(profile, { recursive: true, force: true })
    } catch {}
  }
}

main().catch((e) => {
  console.error(`✗ ${e.message}`)
  process.exit(1)
})
